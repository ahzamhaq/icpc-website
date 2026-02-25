import cron from "node-cron";
import { logger } from "../utils/logger";

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
};
