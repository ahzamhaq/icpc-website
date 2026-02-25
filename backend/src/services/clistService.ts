/**
 * External contest fetching using platform-native APIs.
 *
 * Why not clist.by?  clist.by sits behind Cloudflare which issues a
 * "managed challenge" (403) for requests from datacenter IPs
 * (Render, Railway, Fly, etc.) regardless of User-Agent.
 *
 * Instead we call each platform's own open API:
 *   • Codeforces — official REST API, no auth, no Cloudflare
 *   • LeetCode   — official GraphQL, no auth, public
 *   • clist.by   — optional fallback for CodeChef/HackerRank;
 *                  silently skipped on 403 (no error spam in logs)
 */

export interface ExternalContest {
    name: string;
    url: string;
    startTime: string; // ISO-8601 with Z suffix
    endTime: string;   // ISO-8601 with Z suffix
    duration: number;  // seconds
    platform: string;
    platformIcon: string;
}

// ── In-memory cache ────────────────────────────────────────────────────────────
let cache: ExternalContest[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// ── Helpers ────────────────────────────────────────────────────────────────────
function toUTCISO(dateStr: string): string {
    if (!dateStr) return dateStr;
    return dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
}

// ── Codeforces ─────────────────────────────────────────────────────────────────
async function fetchCodeforces(): Promise<ExternalContest[]> {
    const res = await fetch("https://codeforces.com/api/contest.list?gym=false", {
        headers: { "Accept": "application/json" },
    });
    if (!res.ok) {
        console.warn(`Codeforces API error ${res.status}`);
        return [];
    }
    const data = (await res.json()) as {
        status: string;
        result: Array<{
            id: number;
            name: string;
            phase: string;
            durationSeconds: number;
            startTimeSeconds?: number;
        }>;
    };
    if (data.status !== "OK") return [];

    const now = Date.now();
    return data.result
        .filter((c) => c.phase === "BEFORE" && c.startTimeSeconds)
        .map((c) => {
            const startMs = c.startTimeSeconds! * 1000;
            const endMs = startMs + c.durationSeconds * 1000;
            return {
                name: c.name,
                url: `https://codeforces.com/contest/${c.id}`,
                startTime: new Date(startMs).toISOString(),
                endTime: new Date(endMs).toISOString(),
                duration: c.durationSeconds,
                platform: "Codeforces",
                platformIcon: "CF",
            };
        })
        .filter((c) => new Date(c.startTime).getTime() > now)
        .slice(0, 20);
}

// ── LeetCode ───────────────────────────────────────────────────────────────────
async function fetchLeetCode(): Promise<ExternalContest[]> {
    const query = `{ upcomingContests { title titleSlug startTime duration } }`;
    try {
        const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Referer": "https://leetcode.com/contest/",
            },
            body: JSON.stringify({ query }),
        });
        if (!res.ok) {
            console.warn(`LeetCode GraphQL error ${res.status}`);
            return [];
        }
        const data = (await res.json()) as {
            data?: {
                upcomingContests?: Array<{
                    title: string;
                    titleSlug: string;
                    startTime: number; // unix seconds
                    duration: number;  // seconds
                }>;
            };
        };
        const contests = data?.data?.upcomingContests ?? [];
        return contests.map((c) => {
            const startMs = c.startTime * 1000;
            const endMs = startMs + c.duration * 1000;
            return {
                name: c.title,
                url: `https://leetcode.com/contest/${c.titleSlug}/`,
                startTime: new Date(startMs).toISOString(),
                endTime: new Date(endMs).toISOString(),
                duration: c.duration,
                platform: "LeetCode",
                platformIcon: "LC",
            };
        });
    } catch (err) {
        console.warn("LeetCode fetch failed:", (err as Error).message);
        return [];
    }
}

// ── clist.by fallback (CodeChef / HackerRank) ──────────────────────────────────
// Only attempted when CLIST_USERNAME and CLIST_API_KEY env vars are set.
// Returns [] silently on Cloudflare 403 — no noisy error logs.
async function fetchClistFallback(): Promise<ExternalContest[]> {
    const username = process.env.CLIST_USERNAME;
    const apiKey = process.env.CLIST_API_KEY;
    if (!username || !apiKey) return [];

    // CodeChef=2, HackerRank=63  (CF & LC handled natively above)
    const nowISO = new Date().toISOString().replace(/\.\d{3}Z$/, "");
    const params = new URLSearchParams({
        upcoming: "true",
        order_by: "start",
        resource_id__in: "2,63",
        start__gt: nowISO,
        limit: "20",
    });

    const PLATFORM_MAP: Record<string, { name: string; icon: string }> = {
        "codechef.com": { name: "CodeChef", icon: "CC" },
        "hackerrank.com": { name: "HackerRank", icon: "HR" },
    };

    try {
        const res = await fetch(`https://clist.by/api/v4/contest/?${params}`, {
            headers: {
                Authorization: `ApiKey ${username}:${apiKey}`,
                "User-Agent": "ICPC-USICT-Portal/1.0 (+https://icpcusict.dev)",
                "Accept": "application/json",
            },
        });
        if (!res.ok) {
            // 403 from Cloudflare is expected on datacenter IPs — just warn, don't error
            console.warn(`clist.by fallback skipped (HTTP ${res.status})`);
            return [];
        }
        const data = (await res.json()) as {
            objects: Array<{
                event: string;
                href: string;
                start: string;
                end: string;
                duration: number;
                resource: string;
            }>;
        };
        return (data.objects || []).map((c) => {
            const info = PLATFORM_MAP[c.resource] ?? {
                name: c.resource,
                icon: c.resource.slice(0, 2).toUpperCase(),
            };
            return {
                name: c.event,
                url: c.href,
                startTime: toUTCISO(c.start),
                endTime: toUTCISO(c.end),
                duration: c.duration,
                platform: info.name,
                platformIcon: info.icon,
            };
        });
    } catch (err) {
        console.warn("clist.by fallback failed:", (err as Error).message);
        return [];
    }
}

// ── Public entry point ─────────────────────────────────────────────────────────
export async function getExternalContests(): Promise<ExternalContest[]> {
    const now = Date.now();
    if (cache.length > 0 && now - cacheTimestamp < CACHE_TTL) {
        return cache;
    }

    const [cf, lc, clist] = await Promise.allSettled([
        fetchCodeforces(),
        fetchLeetCode(),
        fetchClistFallback(),
    ]);

    const results: ExternalContest[] = [
        ...(cf.status === "fulfilled" ? cf.value : []),
        ...(lc.status === "fulfilled" ? lc.value : []),
        ...(clist.status === "fulfilled" ? clist.value : []),
    ];

    results.sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    cache = results;
    cacheTimestamp = now;
    console.log(
        `External contests fetched: CF=${cf.status === "fulfilled" ? cf.value.length : "err"} ` +
        `LC=${lc.status === "fulfilled" ? lc.value.length : "err"} ` +
        `clist=${clist.status === "fulfilled" ? clist.value.length : "err"}`
    );
    return cache;
}
