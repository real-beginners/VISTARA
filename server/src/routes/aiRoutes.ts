import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import { generateTestResponse } from "../services/geminiService";

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

export default router;
