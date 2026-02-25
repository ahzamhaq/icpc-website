import { Router } from "express";
import * as ctrl from "../controllers/contestController";
import { isAuthenticated, isAdmin } from "../middleware/auth";
import { body } from "express-validator";

const router = Router();

// Create contest (admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  [body("title").isString().notEmpty()],
  ctrl.create
);

// List all contests
router.get("/", ctrl.list);

// User contest history
router.get("/history/me", isAuthenticated, ctrl.history);

// External platform contests (clist.by)
router.get("/external", isAuthenticated, ctrl.externalContests);

// Get single contest by ID
router.get("/:id", ctrl.getById);

// Delete contest (admin only)
router.delete("/:id", isAuthenticated, isAdmin, ctrl.deleteContest);

// Save contest results (admin only - paste from HackerRank)
router.put(
  "/:id/results",
  isAuthenticated,
  isAdmin,
  ctrl.saveResults
);

// Admin: list submissions for a contest
router.get("/:id/submissions", isAuthenticated, isAdmin, ctrl.submissions);

export default router;
