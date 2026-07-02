import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences } from "../types";

/**
 * Parses user natural language query into structured UserPreferences.
 */
export async function parseQueryToPreferences(
  query: string
): Promise<UserPreferences> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const prompt = `
Analyze this natural language query from a user describing their car preferences for the Indian market and parse it into JSON.

User query:
"${query}"

Guidelines:
- budgetMin: Minimum budget in lakhs INR. Default to 4 if not specified.
- budgetMax: Maximum budget in lakhs INR. Default to 35 if not specified.
- transmission: Must be "Manual", "Automatic", or "Any". Default to "Any".
- seatingNeeded: Must be 5 or 7.
  - If family size >= 6 or user explicitly mentions 6/7-seater -> 7
  - Otherwise -> 5
- useCase:
  - Daily Commuting
  - Family Trips
  - Adventure/Off-road
  - Tech & Luxury
- priority:
  - Fuel Economy
  - Safety
  - Performance
  - Comfort
  - Features

Return ONLY valid JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            budgetMin: {
              type: Type.NUMBER,
            },
            budgetMax: {
              type: Type.NUMBER,
            },
            transmission: {
              type: Type.STRING,
            },
            seatingNeeded: {
              type: Type.INTEGER,
            },
            useCase: {
              type: Type.STRING,
            },
            priority: {
              type: Type.STRING,
            },
          },
          required: [
            "budgetMin",
            "budgetMax",
            "transmission",
            "seatingNeeded",
            "useCase",
            "priority",
          ],
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return JSON.parse(text) as UserPreferences;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to parse user preferences using Gemini.");
  }
}