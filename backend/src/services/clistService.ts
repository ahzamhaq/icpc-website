/**
 * External contest sync service.
 *
 * Architecture:
 *   Cron (every 6h) → fetchAndSync() → upsert into PostgreSQL
 *   User request     → getFromDB()   → read from PostgreSQL
 *
 * No live CLIST calls during user requests.
 */
import prisma from "../models/prismaClient";
import { logger } from "../utils/logger";

export interface ExternalContest {
    name: string;
    url: string;
    startTime: string; // ISO
    endTime: string;   // ISO
    duration: number;  // seconds
    platform: string;
    platformIcon: string;
}

// Resource IDs on clist.by
// Codeforces=1, CodeChef=2, HackerRank=63, LeetCode=102
const RESOURCE_IDS = "1,2,63,102";

// Platform display names mapped by resource host
const PLATFORM_MAP: Record<string, { name: string; icon: string }> = {
    "codeforces.com": { name: "Codeforces", icon: "CF" },
    "leetcode.com": { name: "LeetCode", icon: "LC" },
    "codechef.com": { name: "CodeChef", icon: "CC" },
    "hackerrank.com": { name: "HackerRank", icon: "HR" },
};

// Ensure clist timestamps (UTC without Z) are proper ISO strings
function toUTCISO(dateStr: string): string {
    if (!dateStr) return dateStr;
    return dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
}

/**
 * Cron job: fetch from CLIST API and upsert into PostgreSQL.
 * Called every 6 hours + once at startup.
 */
export async function syncExternalContests(): Promise<void> {
    const username = process.env.CLIST_USERNAME;
    const apiKey = process.env.CLIST_API_KEY;

    if (!username || !apiKey) {
        logger.warn("CLIST_USERNAME or CLIST_API_KEY not set, skipping sync");
        return;
    }

    try {
        const nowISO = new Date().toISOString().replace(/\.\d{3}Z$/, "");

        // Credentials go ONLY in the Authorization header — never in the URL.
        const params = new URLSearchParams({
            upcoming: "true",
            order_by: "start",
            resource_id__in: RESOURCE_IDS,
            start__gt: nowISO,
            limit: "50",
        });

        const url = `https://clist.by/api/v4/contest/?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `ApiKey ${username}:${apiKey}`,
                "User-Agent": "ICPC-Website-App",
                Accept: "application/json",
            },
        });

        if (response.status === 403) {
            const text = await response.text();
            const isCloudflare = text.includes("cf_chl") || text.includes("Just a moment");
            logger.error(
                { status: 403, cloudflare: isCloudflare },
                "clist.by blocked — stale DB data preserved"
            );
            return; // stale DB data is fine
        }

        if (!response.ok) {
            const text = await response.text();
            logger.error({ status: response.status, body: text.slice(0, 500) }, "clist.by API error");
            return;
        }

        const data = (await response.json()) as {
            objects: Array<{
                event: string;
                href: string;
                start: string;
                end: string;
                duration: number;
                resource: string;
            }>;
        };

        const contests = data.objects || [];

        // Upsert each contest (dedup by URL)
        let synced = 0;
        for (const c of contests) {
            const platformInfo = PLATFORM_MAP[c.resource] || {
                name: c.resource,
                icon: c.resource.slice(0, 2).toUpperCase(),
            };

            await prisma.externalContest.upsert({
                where: { url: c.href },
                update: {
                    name: c.event,
                    startTime: new Date(toUTCISO(c.start)),
                    endTime: new Date(toUTCISO(c.end)),
                    duration: c.duration,
                    platform: platformInfo.name,
                    platformIcon: platformInfo.icon,
                    resource: c.resource,
                    syncedAt: new Date(),
                },
                create: {
                    name: c.event,
                    url: c.href,
                    startTime: new Date(toUTCISO(c.start)),
                    endTime: new Date(toUTCISO(c.end)),
                    duration: c.duration,
                    platform: platformInfo.name,
                    platformIcon: platformInfo.icon,
                    resource: c.resource,
                },
            });
            synced++;
        }

        // Clean up old contests that ended more than 7 days ago
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const deleted = await prisma.externalContest.deleteMany({
            where: { endTime: { lt: sevenDaysAgo } },
        });

        logger.info(
            { synced, cleaned: deleted.count },
            "External contests synced to database"
        );
    } catch (err) {
        logger.error({ err }, "Failed to sync external contests");
    }
}

/**
 * Read upcoming external contests from the database.
 * Called by the API controller — no CLIST calls, pure DB read.
 */
export async function getExternalContestsFromDB(): Promise<ExternalContest[]> {
    const now = new Date();

    const rows = await prisma.externalContest.findMany({
        where: { startTime: { gt: now } },
        orderBy: { startTime: "asc" },
    });

    return rows.map((r) => ({
        name: r.name,
        url: r.url,
        startTime: r.startTime.toISOString(),
        endTime: r.endTime.toISOString(),
        duration: r.duration,
        platform: r.platform,
        platformIcon: r.platformIcon,
    }));
}
