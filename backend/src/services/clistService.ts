// Uses native fetch (Node 18+)

export interface ExternalContest {
    name: string;
    url: string;
    startTime: string; // ISO with Z suffix
    endTime: string;   // ISO with Z suffix
    duration: number;  // seconds
    platform: string;
    platformIcon: string;
}

// In-memory cache
let cache: ExternalContest[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Resource IDs on clist.by (verified from API)
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
    // clist returns "2026-02-23T14:35:00" (UTC but no Z) — append Z
    return dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
}

export async function getExternalContests(): Promise<ExternalContest[]> {
    const now = Date.now();

    // Return cache if fresh
    if (cache.length > 0 && now - cacheTimestamp < CACHE_TTL) {
        return cache;
    }

    const username = process.env.CLIST_USERNAME;
    const apiKey = process.env.CLIST_API_KEY;

    if (!username || !apiKey) {
        console.warn("CLIST_USERNAME or CLIST_API_KEY not set, skipping external contests");
        return [];
    }

    try {
        // Use start__gt to only get contests that haven't started yet
        const nowISO = new Date().toISOString().replace(/\.\d{3}Z$/, "");

        const params = new URLSearchParams({
            upcoming: "true",
            order_by: "start",
            resource_id__in: RESOURCE_IDS,
            start__gt: nowISO,
            limit: "50",
            username,
            api_key: apiKey,
        });

        const url = `https://clist.by/api/v4/contest/?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `ApiKey ${username}:${apiKey}`,
                "User-Agent": "Mozilla/5.0 (compatible; ICPC-USICT-Portal/1.0; +https://icpcusict.dev)",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`clist.by API error ${response.status}: ${text}`);
            return cache;
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

        cache = (data.objects || []).map((c) => {
            const platformInfo = PLATFORM_MAP[c.resource] || {
                name: c.resource,
                icon: c.resource.slice(0, 2).toUpperCase(),
            };

            return {
                name: c.event,
                url: c.href,
                startTime: toUTCISO(c.start),
                endTime: toUTCISO(c.end),
                duration: c.duration,
                platform: platformInfo.name,
                platformIcon: platformInfo.icon,
            };
        });

        cacheTimestamp = now;
        console.log(`Fetched ${cache.length} external contests from clist.by`);
        return cache;
    } catch (err) {
        console.error("Failed to fetch external contests:", err);
        return cache;
    }
}
