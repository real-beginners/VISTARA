import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import { createTrip, getUserTrips, getTripById } from "../services/tripService";
import { createTripInvitation } from "../services/invitationService";

const router = Router();

// All trip routes require authentication
router.use(requireAuth);

/**
 * POST /api/trips
 * Create a new trip with the authenticated user as owner.
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
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

  const allowedFields = new Set(["title", "destination", "startDate", "endDate", "budget"]);
  const bodyKeys = Object.keys(req.body);
  const disallowed = bodyKeys.filter((k) => !allowedFields.has(k));

  if (disallowed.length > 0) {
    res.status(400).json({
      error: "Bad Request",
      message: `Disallowed fields in request body: ${disallowed.join(", ")}. Allowed fields: title, destination, startDate, endDate, budget.`,
    });
    return;
  }

  const { title, destination, startDate, endDate, budget } = req.body;

  // Title validation
  if (!title || typeof title !== "string" || !title.trim()) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'title' is required and must be a non-empty string.",
    });
    return;
  }
  if (title.trim().length > 100) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'title' cannot exceed 100 characters.",
    });
    return;
  }

  // Destination validation
  if (!destination || typeof destination !== "string" || !destination.trim()) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'destination' is required and must be a non-empty string.",
    });
    return;
  }
  if (destination.trim().length > 100) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'destination' cannot exceed 100 characters.",
    });
    return;
  }

  // Date validation (optional)
  if (startDate !== undefined && startDate !== null) {
    if (typeof startDate !== "string" || startDate.length > 50) {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'startDate' must be a valid date string.",
      });
      return;
    }
  }

  if (endDate !== undefined && endDate !== null) {
    if (typeof endDate !== "string" || endDate.length > 50) {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'endDate' must be a valid date string.",
      });
      return;
    }
  }

  // Budget validation (optional)
  if (budget !== undefined && budget !== null) {
    if (typeof budget !== "number" || isNaN(budget) || budget < 0) {
      res.status(400).json({
        error: "Bad Request",
        message: "Field 'budget' must be a non-negative number.",
      });
      return;
    }
  }

  try {
    const trip = await createTrip(uid, {
      title: title.trim(),
      destination: destination.trim(),
      startDate: startDate ? startDate.trim() : null,
      endDate: endDate ? endDate.trim() : null,
      budget: budget ?? null,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("[Trips API] Error creating trip:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create trip.",
    });
  }
});

/**
 * GET /api/trips
 * Get all trips where the authenticated user is a member.
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  try {
    const trips = await getUserTrips(uid);
    res.json(trips);
  } catch (error) {
    console.error("[Trips API] Error fetching user trips:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch trips.",
    });
  }
});

/**
 * GET /api/trips/:tripId
 * Get single trip with member list. Only accessible to trip members.
 */
router.get("/:tripId", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  const { tripId } = req.params;
  if (!tripId || typeof tripId !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Invalid trip ID parameter." });
    return;
  }

  try {
    const { trip, isMember } = await getTripById(tripId, uid);

    if (!trip && !isMember) {
      res.status(404).json({
        error: "Not Found",
        message: "Trip not found.",
      });
      return;
    }

    if (!isMember) {
      res.status(403).json({
        error: "Forbidden",
        message: "You are not a member of this trip.",
      });
      return;
    }

    res.json(trip);
  } catch (error) {
    console.error("[Trips API] Error fetching trip:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch trip details.",
    });
  }
});

/**
 * POST /api/trips/:tripId/invitations
 * Invite another Vistara user to join this trip.
 */
router.post("/:tripId/invitations", async (req: Request, res: Response): Promise<void> => {
  const senderId = req.user?.uid;
  if (!senderId) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  const { tripId } = req.params;
  if (!tripId || typeof tripId !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Invalid trip ID parameter." });
    return;
  }

  const { recipientId } = req.body || {};
  if (!recipientId || typeof recipientId !== "string" || !recipientId.trim()) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'recipientId' is required and must be a non-empty string.",
    });
    return;
  }

  try {
    const result = await createTripInvitation(tripId, senderId, recipientId.trim());

    if (result.error) {
      res.status(result.status || 400).json({
        error: result.status === 403 ? "Forbidden" : result.status === 404 ? "Not Found" : "Bad Request",
        message: result.error,
      });
      return;
    }

    res.status(201).json(result.invitation);
  } catch (error) {
    console.error("[Trips API] Error inviting user:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to send trip invitation.",
    });
  }
});

/**
 * GET /api/trips/:tripId/messages
 * Get all messages for a trip. Only accessible to trip members.
 */
router.get("/:tripId/messages", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  const { tripId } = req.params;
  if (!tripId || typeof tripId !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Invalid trip ID parameter." });
    return;
  }

  try {
    const { isMember, tripExists } = await getTripById(tripId, uid);

    if (!tripExists) {
      res.status(404).json({ error: "Not Found", message: "Trip not found." });
      return;
    }

    if (!isMember) {
      res.status(403).json({ error: "Forbidden", message: "You are not a member of this trip." });
      return;
    }

    const { getTripMessages } = await import("../services/tripService");
    const messages = await getTripMessages(tripId);
    res.json(messages);
  } catch (error) {
    console.error("[Trips API] Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch messages." });
  }
});

/**
 * POST /api/trips/:tripId/messages
 * Send a message in a trip. Only accessible to trip members.
 */
router.post("/:tripId/messages", async (req: Request, res: Response): Promise<void> => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized", message: "User identity missing." });
    return;
  }

  const { tripId } = req.params;
  if (!tripId || typeof tripId !== "string") {
    res.status(400).json({ error: "Bad Request", message: "Invalid trip ID parameter." });
    return;
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "Bad Request", message: "Message text is required and cannot be empty." });
    return;
  }

  if (text.length > 2000) {
    res.status(400).json({ error: "Bad Request", message: "Message is too long." });
    return;
  }

  try {
    const { isMember, tripExists } = await getTripById(tripId, uid);

    if (!tripExists) {
      res.status(404).json({ error: "Not Found", message: "Trip not found." });
      return;
    }

    if (!isMember) {
      res.status(403).json({ error: "Forbidden", message: "You are not a member of this trip." });
      return;
    }

    const { sendTripMessage } = await import("../services/tripService");
    const { getAuth } = await import("firebase-admin/auth");
    const userRecord = await getAuth().getUser(uid).catch(() => null);
    const senderName = userRecord?.displayName || "Unknown User";

    const message = await sendTripMessage(tripId, uid, senderName, text);
    res.status(201).json(message);
  } catch (error) {
    console.error("[Trips API] Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to send message." });
  }
});

export default router;
