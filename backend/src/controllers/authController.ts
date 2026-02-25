import { Request, Response } from "express";
import * as authService from "../services/authService";
import * as googleAuthService from "../services/googleAuthService";
import { success, fail } from "../utils/response";
import { validationResult } from "express-validator";
import prisma from "../models/prismaClient";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, { errors: errors.array() }, 422);
  try {
    const { email, password, role } = req.body;
    const user = await authService.registerUser(email, password, role);
    success(res, { id: user.id, email: user.email }, 201);
  } catch (err: any) {
    fail(res, err.message);
  }
};



export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await authService.getAllUsers();
    success(res, users);
  } catch (err: any) {
    fail(res, err.message);
  }
};





export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["STUDENT", "ADMIN", "ALUMNI"].includes(role)) {
      return fail(res, "Invalid role", 400);
    }
    const user = await authService.updateUserRole(id, role);
    success(res, user);
  } catch (err: any) {
    fail(res, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    success(res, data);
  } catch (err: any) {
    fail(res, err.message, 401);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as any).user;

    const result = await authService.deleteUser(id, requestingUser.id);
    success(res, result);
  } catch (err: any) {
    fail(res, err.message, 400);
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return fail(res, "Authentication failed", 401);
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // Generate JWT token for user (no approval needed)
    const token = googleAuthService.generateToken(user.id, user.role);

    // Check if this is a new user who needs to select a role
    const isNewUser = (user as any).isNewUser || false;

    if (isNewUser) {
      // Redirect new users to role selection page
      res.redirect(
        `${frontendUrl}/select-role?token=${token}&userId=${user.id}&email=${encodeURIComponent(user.email)}`
      );
    } else {
      // Redirect existing users to the normal callback
      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&userId=${user.id}&email=${encodeURIComponent(user.email)}&role=${user.role}`
      );
    }
  } catch (err: any) {
    fail(res, err.message, 401);
  }
};

// Select role for new Google OAuth users
export const selectRole = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return fail(res, "User not authenticated", 401);
    }

    const { role } = req.body;

    // Validate role — only STUDENT or ALUMNI allowed via this endpoint
    const validRoles = ["STUDENT", "ALUMNI"];
    if (!role || !validRoles.includes(role)) {
      return fail(res, "Invalid role. Must be one of: STUDENT, ALUMNI", 400);
    }

    // ⚠️ CRITICAL: Never downgrade an ADMIN via this endpoint
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) {
      return fail(res, "User not found", 404);
    }
    if (currentUser.role === "ADMIN") {
      // Admin is already set — just return their current token, don't touch the role
      const token = googleAuthService.generateToken(currentUser.id, currentUser.role);
      return success(res, {
        user: { id: currentUser.id, email: currentUser.email, role: currentUser.role },
        token,
      });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: { profile: true },
    });

    // Generate new token with updated role
    const token = googleAuthService.generateToken(updatedUser.id, updatedUser.role);

    return success(res, {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      token,
    });
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
};
