import { Request, Response } from "express";
import * as svc from "../services/contestService";
import { getExternalContestsFromDB } from "../services/clistService";
import { success, fail } from "../utils/response";

export const create = async (req: Request, res: Response) => {
  try {
    const c = await svc.createContest(req.body);
    success(res, c, 201);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const list = await svc.listContests();
    success(res, list);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contest = await svc.getContest(id);
    if (!contest) return fail(res, "Contest not found", 404);
    success(res, contest);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const deleteContest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await svc.deleteContest(id);
    success(res, { message: "Contest deleted successfully" });
  } catch (err: any) {
    fail(res, err.message);
  }
};

/**
 * Save contest results (admin enters leaderboard from HackerRank)
 * Expects: { results: [{ rank, name, score, ... }] }
 */
export const saveResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { results } = req.body;
    if (!results) return fail(res, "Results data is required", 400);
    const c = await svc.saveResults(id, results);
    success(res, c);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const history = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const h = await svc.userHistory(userId);
    success(res, h);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const submissions = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const list = await svc.getContestSubmissions(id);
    success(res, list);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const externalContests = async (_req: Request, res: Response) => {
  try {
    const contests = await getExternalContestsFromDB();
    success(res, contests);
  } catch (err: any) {
    fail(res, err.message);
  }
};
