"use client";

import { useEffect, useState, useCallback } from "react";
import { getContests, Contest, getExternalContests, ExternalContest } from "@/lib/contestService";
import { Loader2, ExternalLink, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Input } from "@/components/ui/input";
import { PlatformLogoMap } from "@/components/platform-logos";
import { motion } from "framer-motion";
import Link from "next/link";

/* ── Platform colors ── */
const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Codeforces: { bg: "bg-[#1890FF]/10", text: "text-[#1890FF]", border: "border-[#1890FF]/30" },
  LeetCode: { bg: "bg-[#FFA116]/10", text: "text-[#FFA116]", border: "border-[#FFA116]/30" },
  CodeChef: { bg: "bg-[#5B4638]/10", text: "text-[#C4A882]", border: "border-[#5B4638]/30" },
  HackerRank: { bg: "bg-[#2EC866]/10", text: "text-[#2EC866]", border: "border-[#2EC866]/30" },
};

/* ── Countdown timer component ── */
function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isStartingSoon, setIsStartingSoon] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) { setTimeLeft("starting now!"); setIsStartingSoon(true); return; }

      setIsStartingSoon(diff < 600000); // < 10 minutes

      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (days > 0) setTimeLeft(`${days}d ${hrs}h ${mins}m`);
      else if (hrs > 0) setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      else setTimeLeft(`${mins}m ${secs}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <span className={`font-mono text-sm ${isStartingSoon ? "text-[#F85149] font-bold" : "text-[#D29922]"}`}>
      {isStartingSoon && <span className="inline-block w-2 h-2 rounded-full bg-[#F85149] animate-pulse mr-1.5" />}
      {timeLeft}
    </span>
  );
}

/* ── Card entrance animation ── */
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: [0, 0, 0.2, 1] as const },
  }),
};

/* ── Format duration ── */
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [externalContests, setExternalContests] = useState<ExternalContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  useEffect(() => {
    const fetchContests = async () => {
      try { const data = await getContests(); setContests(data); }
      catch { console.error("Failed to fetch contests"); }
      finally { setLoading(false); }
    };
    const fetchExternal = async () => {
      try { const data = await getExternalContests(); setExternalContests(data); }
      catch { console.error("Failed to fetch external contests"); }
      finally { setExternalLoading(false); }
    };
    fetchContests();
    fetchExternal();
  }, []);

  const getContestStatus = useCallback((contest: Contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(startTime.getTime() + contest.timer * 60 * 1000);
    if (now < startTime) return "upcoming";
    if (now > endTime) return "ended";
    return "active";
  }, []);

  const filtered = contests.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcoming = filtered.filter((c) => getContestStatus(c) !== "ended");
  const past = filtered.filter((c) => getContestStatus(c) === "ended");

  // External contests filtering
  const platforms = [...new Set(externalContests.map((c) => c.platform))];
  const filteredExternal = externalContests.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || c.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-0">

        {/* Header */}
        <section className="py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            &gt; <span className="font-bold">contests</span>{" "}
            <span className="font-normal text-muted-foreground">--arena</span>
          </h1>
        </section>

        {/* Search bar */}
        <section className="py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="> search contests: _"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 bg-card border-border"
            />
          </div>
        </section>

        <hr className="border-border" />

        {/* ── Club Contests ── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Upcoming / Active */}
            {upcoming.length > 0 && (
              <section className="py-4">
                <p className="text-sm font-semibold text-foreground mb-3">
                  &gt; club contests
                </p>
                {upcoming.map((contest, i) => {
                  const status = getContestStatus(contest);
                  const start = new Date(contest.startTime);
                  const endTime = new Date(start.getTime() + contest.timer * 60 * 1000);
                  const isLive = status === "active";
                  const isStartingSoon = status === "upcoming" && (start.getTime() - Date.now()) < 600000;

                  return (
                    <motion.div
                      key={contest.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="show"
                      className={`py-4 border-b border-border/50 ${isStartingSoon ? "border-l-2 border-l-[#F85149] pl-3 -ml-[2px]" : isLive ? "border-l-2 border-l-[#3FB950] pl-3 -ml-[2px]" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/contests/${contest.id}`} className="hover:underline">
                              <span className="text-[#58A6FF]">[{contest.id.slice(0, 4)}]</span>{" "}
                              <span className="text-lg font-semibold text-foreground">{contest.title}</span>
                            </Link>
                            {isLive && (
                              <span className="text-xs text-[#3FB950] border border-[#3FB950]/30 px-2 py-0.5 inline-flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse" />
                                LIVE
                              </span>
                            )}
                            {isStartingSoon && (
                              <span className="text-xs text-[#F85149] border border-[#F85149]/30 px-2 py-0.5 animate-pulse">
                                STARTING SOON
                              </span>
                            )}
                          </div>

                          <div className="mt-2 space-y-1 text-sm">
                            {status === "upcoming" && (
                              <p className="flex items-center gap-2">
                                <span className="text-muted-foreground">&gt; starts_in: </span>
                                <Countdown targetDate={start} />
                              </p>
                            )}
                            {isLive && (
                              <p className="flex items-center gap-2">
                                <span className="text-muted-foreground">&gt; ends_in: </span>
                                <Countdown targetDate={endTime} />
                              </p>
                            )}
                            {contest.hackerRankUrl && (
                              <p>
                                <span className="text-muted-foreground">&gt; platform: </span>
                                <a href={contest.hackerRankUrl} target="_blank" rel="noopener noreferrer" className="text-[#3FB950] hover:underline">HackerRank</a>
                              </p>
                            )}
                            <p>
                              <span className="text-muted-foreground">&gt; starts: </span>
                              <span className="text-foreground">
                                {start.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}{" "}
                                {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} IST
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">&gt; duration: </span>
                              <span className="text-foreground">{contest.timer} min</span>
                            </p>
                          </div>
                        </div>
                        <Link href={isLive && contest.hackerRankUrl ? contest.hackerRankUrl : `/contests/${contest.id}`}
                          target={isLive && contest.hackerRankUrl ? "_blank" : undefined}
                          rel={isLive && contest.hackerRankUrl ? "noopener noreferrer" : undefined}
                        >
                          <button className={`text-sm border px-4 py-2 transition-all inline-flex items-center gap-2 ${isLive
                            ? "border-[#3FB950] text-[#3FB950] hover:bg-[#3FB950]/10"
                            : isStartingSoon
                              ? "border-[#F85149] text-[#F85149] hover:bg-[#F85149]/10 animate-pulse"
                              : "border-border text-foreground hover:bg-muted"
                            }`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                            {isLive ? "JOIN NOW" : "ENTER"}
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </section>
            )}

            {/* Past contests */}
            {past.length > 0 && (
              <section className="py-4">
                <p className="text-sm font-semibold text-foreground mb-3">
                  &gt; past contests
                </p>
                {past.map((contest, i) => (
                  <motion.div
                    key={contest.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    className="flex items-center gap-3 text-sm py-2 border-b border-border/50"
                  >
                    <span className="text-[#3FB950]">[✓]</span>
                    <Link href={`/contests/${contest.id}`} className="text-foreground font-medium hover:underline flex-1">
                      {contest.title}
                    </Link>
                    <span className="text-muted-foreground">{contest.timer} min</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(contest.startTime).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </section>
            )}
          </>
        )}

        <hr className="border-border" />

        {/* ── Platform Contests (clist.by) ── */}
        <section className="py-4">
          <p className="text-sm font-semibold text-foreground mb-3">
            &gt; platform contests <span className="font-normal text-muted-foreground">--upcoming</span>
          </p>

          {/* Platform filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setPlatformFilter("all")}
              className={`px-3 py-1 text-xs border transition-colors ${platformFilter === "all"
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              [ all ]
            </button>
            {platforms.map((p) => {
              const colors = PLATFORM_COLORS[p] || { bg: "", text: "text-foreground", border: "border-border" };
              const Logo = PlatformLogoMap[p];
              return (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-3 py-1.5 text-xs border transition-colors inline-flex items-center gap-1.5 ${platformFilter === p
                    ? `${colors.border} ${colors.text}`
                    : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {Logo && <Logo size={14} />}
                  {p}
                </button>
              );
            })}
          </div>

          {externalLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredExternal.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">&gt; no upcoming platform contests found</p>
          ) : (
            <div className="space-y-0">
              {filteredExternal.map((contest, i) => {
                const start = new Date(contest.startTime);
                const colors = PLATFORM_COLORS[contest.platform] || {
                  bg: "bg-muted", text: "text-foreground", border: "border-border",
                };

                return (
                  <motion.div
                    key={`${contest.platform}-${contest.name}-${i}`}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    className="py-3 border-b border-border/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Platform logo */}
                          {(() => {
                            const Logo = PlatformLogoMap[contest.platform];
                            return Logo ? (
                              <span className={`inline-flex items-center justify-center w-6 h-6 border ${colors.bg} ${colors.text} ${colors.border}`}>
                                <Logo size={14} />
                              </span>
                            ) : (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${colors.bg} ${colors.text} ${colors.border}`}>
                                {contest.platformIcon}
                              </span>
                            );
                          })()}
                          <span className="text-sm font-medium text-foreground truncate">
                            {contest.name}
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            {start.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}{" "}
                            {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span>⏱ {formatDuration(contest.duration)}</span>
                          <Countdown targetDate={start} />
                        </div>
                      </div>
                      <a
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs border px-3 py-1.5 transition-colors inline-flex items-center gap-1.5 shrink-0 ${colors.border} ${colors.text} hover:opacity-80`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        OPEN
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
