import { GoogleGenAI } from "@google/genai";
import type { TripDocument } from "./tripService";

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

/**
 * Generate activity suggestions for a trip using available trip context.
 */
export async function generateTripActivitySuggestions(trip: TripDocument): Promise<string> {
  const ai = getGeminiClient();

  const groupSize =
    trip.members && trip.members.length > 0
      ? `${trip.members.length} traveler(s)`
      : `${trip.memberUids?.length || 1} traveler(s)`;

  const dateRange =
    trip.startDate && trip.endDate
      ? `${trip.startDate} to ${trip.endDate}`
      : trip.startDate
      ? `Starting ${trip.startDate}`
      : "Flexible dates";

  const budgetInfo =
    trip.budget !== null && trip.budget !== undefined
      ? `Budget: ${trip.budget}`
      : "Budget: Not specified";

  const prompt = `You are an expert travel planner for Vistara.
Generate a curated list of useful, engaging travel activity suggestions tailored for the following trip:

- Trip Title: ${trip.title}
- Destination: ${trip.destination}
- Dates: ${dateRange}
- ${budgetInfo}
- Group Context: ${groupSize}

Please provide 3 to 5 practical, high-quality activity recommendations suitable for this group and destination. For each activity, include:
1. Activity Name
2. Description
3. Why it is suitable for this trip
4. Practical tip (e.g. ideal timing, budget/cost tip, or booking advice)

Keep the formatting clean and readable.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text ?? "No suggestions could be generated for this trip.";
}

