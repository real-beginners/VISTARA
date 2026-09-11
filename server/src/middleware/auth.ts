import { Request, Response, NextFunction } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAuthAdmin, isFirebaseAdminConfigured } from "../config/firebaseAdmin";

// Extend Express Request type declaration to include verified Firebase user token
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: DecodedIdToken;
}

/**
 * Authentication middleware verifying Firebase ID Tokens sent via Authorization header
 * Expected format: Bearer <Firebase ID token>
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Missing or malformed Authorization header. Expected format: Bearer <token>",
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication token is missing.",
    });
    return;
  }

  if (!isFirebaseAdminConfigured()) {
    res.status(500).json({
      error: "Server Error",
      message: "Firebase Admin is not configured on the server.",
    });
    return;
  }

  const auth = getFirebaseAuthAdmin();
  if (!auth) {
    res.status(500).json({
      error: "Server Error",
      message: "Firebase Auth service is unavailable.",
    });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    // Return standard 401 without exposing sensitive Firebase internals
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired authentication token.",
    });
  }
}
