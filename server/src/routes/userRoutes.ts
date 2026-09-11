import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import { getUserProfile, upsertUserProfile } from "../services/userService";

const router = Router();

/**
 * GET /api/users/me
 * Reads the authenticated user's profile from Firestore `users/{uid}`.
 * Returns 404 if not found without auto-creating.
 */
router.get("/me", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  try {
    const profile = await getUserProfile(uid);
    if (!profile) {
      res.status(404).json({
        error: "Not Found",
        message: "User profile not found in Firestore.",
      });
      return;
    }

    res.json(profile);
  } catch (error) {
    console.error("[Users API] Error fetching user profile:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve user profile.",
    });
  }
});

/**
 * PUT /api/users/me
 * Creates or updates ONLY the authenticated user's own profile document `users/{uid}`.
 * Validates request body to allow only displayName and photoURL.
 */
router.put("/me", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({
      error: "Bad Request",
      message: "Request body must be a JSON object.",
    });
    return;
  }

  // Validate allowed fields
  const allowedKeys = new Set(["displayName", "photoURL"]);
  const bodyKeys = Object.keys(req.body);
  const disallowedKeys = bodyKeys.filter((key) => !allowedKeys.has(key));

  if (disallowedKeys.length > 0) {
    res.status(400).json({
      error: "Bad Request",
      message: `Disallowed fields in request body: ${disallowedKeys.join(", ")}. Only 'displayName' and 'photoURL' are permitted.`,
    });
    return;
  }

  const { displayName, photoURL } = req.body;

  if (displayName !== undefined && displayName !== null) {
    if (typeof displayName !== "string") {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'displayName' must be a string.",
      });
      return;
    }
    if (displayName.trim().length > 100) {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'displayName' cannot exceed 100 characters.",
      });
      return;
    }
  }

  if (photoURL !== undefined && photoURL !== null) {
    if (typeof photoURL !== "string") {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'photoURL' must be a string.",
      });
      return;
    }
    if (photoURL.length > 1000) {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'photoURL' cannot exceed 1000 characters.",
      });
      return;
    }
  }

  try {
    const updatedProfile = await upsertUserProfile(uid, req.user?.email ?? null, {
      displayName: displayName !== undefined ? (typeof displayName === "string" ? displayName.trim() : null) : undefined,
      photoURL: photoURL !== undefined ? (typeof photoURL === "string" ? photoURL.trim() : null) : undefined,
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("[Users API] Error updating user profile:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update user profile.",
    });
  }
});

export default router;
