import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
}

export function getGeminiClient(): GoogleGenAI {
  if (!isGeminiConfigured()) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY to server/.env"
    );
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!.trim(),
    });
  }

  return aiInstance;
}

/**
 * Generate a response using the official Gemini SDK and the recommended Flash model.
 */
export async function generateTestResponse(prompt: string): Promise<string> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text ?? "No response generated from Gemini.";
}
