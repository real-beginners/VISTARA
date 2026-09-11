import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import { generateTestResponse, generateTripActivitySuggestions } from "../services/geminiService";
import { getTripById } from "../services/tripService";

const router = Router();

// All AI routes require authentication
router.use(requireAuth);

/**
 * POST /api/ai/test
 * Authenticated test endpoint to verify Gemini API integration.
 */
router.post("/test", async (req: Request, res: Response): Promise<void> => {
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

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'prompt' is required and must be a non-empty string.",
    });
    return;
  }

  if (prompt.trim().length > 2000) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'prompt' exceeds maximum allowed length of 2000 characters.",
    });
    return;
  }

  try {
    const aiResponse = await generateTestResponse(prompt.trim());
    res.json({
      response: aiResponse,
    });
  } catch (error: unknown) {
    console.error("[AI API] Error generating content:", error);
    const message = error instanceof Error ? error.message : "Failed to generate AI response.";
    res.status(500).json({
      error: "Internal Server Error",
      message,
    });
  }
});

/**
 * POST /api/ai/trip-suggestions
 * Generate activity suggestions for an existing trip.
 * Requires authenticated trip membership.
 */
router.post("/trip-suggestions", async (req: Request, res: Response): Promise<void> => {
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

  const { tripId } = req.body;

  if (!tripId || typeof tripId !== "string" || !tripId.trim()) {
    res.status(400).json({
      error: "Bad Request",
      message: "Field 'tripId' is required and must be a non-empty string.",
    });
    return;
  }

  const trimmedTripId = tripId.trim();

  try {
    // Load full trip details and verify membership in a single service call
    const { trip, isMember, tripExists } = await getTripById(trimmedTripId, uid);

    if (!tripExists) {
      res.status(404).json({
        error: "Not Found",
        message: "Trip not found.",
      });
      return;
    }

    if (!isMember || !trip) {
      res.status(403).json({
        error: "Forbidden",
        message: "You are not a member of this trip.",
      });
      return;
    }

    const suggestions = await generateTripActivitySuggestions(trip);

    res.json({
      tripId: trip.id,
      destination: trip.destination,
      suggestions,
    });
  } catch (error: unknown) {
    console.error("[AI API] Error generating trip suggestions:", error);
    const message = error instanceof Error ? error.message : "Failed to generate trip suggestions.";
    res.status(500).json({
      error: "Internal Server Error",
      message,
    });
  }
});

export default router;


