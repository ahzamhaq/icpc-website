import cron from "node-cron";
import { logger } from "../utils/logger";
import { syncExternalContests } from "../services/clistService";

let jobsStarted = false;

export const startJobs = () => {
  if (jobsStarted) {
    logger.debug("Jobs already started; skipping re-registration");
    return;
  }
  jobsStarted = true;

  // daily streak update at 00:05
  cron
    .schedule("5 0 * * *", async () => {
      logger.info("Running daily streak update...");
      try {
        // Placeholder: update streaks based on submissions
      } catch (err) {
        logger.error({ err }, "Streak job error");
      }
    })
    .start();

  // leaderboard refresh every hour
  cron.schedule("0 * * * *", async () => {
    logger.info("Refreshing leaderboards...");
    try {
      // compute leaderboards and cache if needed
    } catch (err) {
      logger.error({ err }, "Leaderboard job error");
    }
  });

  // External contest sync every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    logger.info("Syncing external contests from CLIST...");
    try {
      await syncExternalContests();
    } catch (err) {
      logger.error({ err }, "External contest sync job error");
    }
  });

  // Sync once at startup (non-blocking)
  syncExternalContests().catch((err) =>
    logger.error({ err }, "Startup external contest sync failed")
  );
};
