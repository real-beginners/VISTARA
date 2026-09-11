import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import {
  getUserInvitations,
  acceptTripInvitation,
  declineTripInvitation,
} from "../services/invitationService";

const router = Router();

// All invitation routes require authentication
router.use(requireAuth);

/**
 * GET /api/trip-invitations
 * View all trip invitations received by the authenticated user.
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  try {
    const invitations = await getUserInvitations(uid);
    res.json(invitations);
  } catch (error) {
    console.error("[Invitations API] Error fetching invitations:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch trip invitations.",
    });
  }
});

/**
 * POST /api/trip-invitations/:invitationId/accept
 * Accept a pending trip invitation and join the trip.
 */
router.post("/:invitationId/accept", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  const { invitationId } = req.params;
  if (!invitationId || typeof invitationId !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Invalid invitation ID parameter." });
    return;
  }

  try {
    const result = await acceptTripInvitation(invitationId, uid);

    if (result.error) {
      res.status(result.status || 400).json({
        error: result.status === 403 ? "Forbidden" : result.status === 404 ? "Not Found" : "Bad Request",
        message: result.error,
      });
      return;
    }

    res.json({
      message: "Invitation accepted successfully.",
      tripId: result.tripId,
    });
  } catch (error) {
    console.error("[Invitations API] Error accepting invitation:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to accept trip invitation.",
    });
  }
});

/**
 * POST /api/trip-invitations/:invitationId/decline
 * Decline a pending trip invitation.
 */
router.post("/:invitationId/decline", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  const { invitationId } = req.params;
  if (!invitationId || typeof invitationId !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Invalid invitation ID parameter." });
    return;
  }


  try {
    const result = await declineTripInvitation(invitationId, uid);

    if (result.error) {
      res.status(result.status || 400).json({
        error: result.status === 403 ? "Forbidden" : result.status === 404 ? "Not Found" : "Bad Request",
        message: result.error,
      });
      return;
    }

    res.json({
      message: "Invitation declined.",
      invitationId,
    });
  } catch (error) {
    console.error("[Invitations API] Error declining invitation:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to decline trip invitation.",
    });
  }
});

export default router;
