import api from "./axios";

// Types
export interface Contest {
  id: string;
  title: string;
  hackerRankUrl?: string;
  problems?: Problem[];
  timer: number; // duration in minutes
  results?: ContestResult[];
  createdAt: string;
  startTime: string;
}

export interface Problem {
  name: string;
  description?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
}

export interface ContestResult {
  rank: number;
  name: string;
  score?: number;
  solved?: number;
  userId?: string;
}

// API Functions

export async function getContests(): Promise<Contest[]> {
  const response = await api.get("/contests");
  return response.data.data || response.data;
}

export async function getContestById(id: string): Promise<Contest> {
  const response = await api.get(`/contests/${id}`);
  return response.data.data || response.data;
}

export async function getContestHistory(): Promise<Contest[]> {
  const response = await api.get("/contests/history/me");
  return response.data.data || response.data;
}

// External platform contests (clist.by)
export interface ExternalContest {
  name: string;
  url: string;
  startTime: string;
  endTime: string;
  duration: number; // seconds
  platform: string;
  platformIcon: string;
}

export async function getExternalContests(): Promise<ExternalContest[]> {
  const response = await api.get("/contests/external");
  return response.data.data || response.data;
}
