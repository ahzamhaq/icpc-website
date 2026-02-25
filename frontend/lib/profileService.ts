import api from "./axios";

// Types
export interface Handles {
  leetcode?: string;
  codeforces?: string;
  codechef?: string;
  atcoder?: string;
  hackerrank?: string;
  github?: string;
}

export interface Profile {
  id?: string;
  userId?: string;
  name: string;
  branch: string;
  year: number;
  contact: string;
  handles?: Handles;
  // Alumni-specific fields
  graduationYear?: number | null;
  company?: string | null;
  position?: string | null;
  location?: string | null;
  bio?: string | null;
  linkedIn?: string | null;
}

export interface ProfileInput {
  name: string;
  branch: string;
  year: number;
  contact?: string;
  handles?: Handles;
  // Alumni-specific fields
  graduationYear?: number | null;
  company?: string | null;
  position?: string | null;
  location?: string | null;
  bio?: string | null;
  linkedIn?: string | null;
}

// Branch options
export const BRANCH_OPTIONS = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "IT", label: "IT" },
  { value: "CSE-AI", label: "CSE-AI" },
  { value: "CSE-DS", label: "CSE-DS" },
  { value: "MCA", label: "MCA" },
] as const;

// Year options
export const YEAR_OPTIONS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
] as const;

// Graduation year options (for alumni)
const currentYear = new Date().getFullYear();
export const GRADUATION_YEAR_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString(),
}));

// Competitive programming platforms
export const CP_PLATFORMS = [
  { key: "leetcode", label: "LeetCode", placeholder: "username" },
  { key: "codeforces", label: "Codeforces", placeholder: "handle" },
  { key: "codechef", label: "CodeChef", placeholder: "username" },
  { key: "atcoder", label: "AtCoder", placeholder: "username" },
  { key: "hackerrank", label: "HackerRank", placeholder: "username" },
  { key: "github", label: "GitHub", placeholder: "username" },
] as const;

// API Functions

export async function getProfile(): Promise<Profile | null> {
  try {
    const response = await api.get("/profile");
    return response.data.data || null;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    // 404 means no profile exists yet
    if (err.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Returns true only when the profile has been genuinely filled out.
 *
 * Google OAuth creates a SKELETON profile immediately on first sign-in:
 *   { name: "Display Name", branch: "", year: 1, contact: "" }
 * That skeleton makes `!!profile` truthy even though the user never
 * completed the form.  Checking branch (a required select field with
 * no empty default) is the clean discriminant — it's always "" in the
 * skeleton and always a real value ("CSE", "ECE", …) once saved.
 */
export function isProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  return !!profile.branch?.trim();
}

export async function updateProfile(data: ProfileInput): Promise<Profile> {
  const response = await api.post("/profile", data);
  return response.data.data || response.data;
}

// Validation helpers

export function validatePhone(phone: string): boolean {
  if (!phone || phone.trim() === "") return true; // Optional field
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.trim());
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === "") {
    return { valid: false, error: "Name is required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  return { valid: true };
}

export function validateBranch(branch: string): boolean {
  return BRANCH_OPTIONS.some((b) => b.value === branch);
}

export function validateYear(year: number): boolean {
  return YEAR_OPTIONS.some((y) => y.value === year);
}
