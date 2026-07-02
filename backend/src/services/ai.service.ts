import { UserPreferences } from '../types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Parses user natural language query into structured UserPreferences.
 */
export async function parseQueryToPreferences(query: string): Promise<UserPreferences> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const prompt = `
Analyze this natural language query from a user describing their car preferences for the Indian market and parse it into the requested JSON schema.

User query: "${query}"

Guidelines:
- budgetMin: Minimum budget in lakhs INR. Default to 4 if not specified.
- budgetMax: Maximum budget in lakhs INR. Default to 35 if not specified.
- transmission: Must be 'Manual', 'Automatic', or 'Any'. Default to 'Any' if not specified.
- seatingNeeded: Must be 5 or 7. If they mention family size >= 6 or explicitly say "7-seater/6-seater", choose 7. Otherwise, default to 5.
- useCase: Choose the closest fit from: 'Daily Commuting', 'Family Trips', 'Adventure/Off-road', 'Tech & Luxury'.
- priority: Choose the closest fit from: 'Fuel Economy', 'Safety', 'Performance', 'Comfort', 'Features'.
`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          budgetMin: { type: 'NUMBER' },
          budgetMax: { type: 'NUMBER' },
          transmission: { type: 'STRING', enum: ['Manual', 'Automatic', 'Any'] },
          seatingNeeded: { type: 'INTEGER' },
          useCase: { type: 'STRING', enum: ['Daily Commuting', 'Family Trips', 'Adventure/Off-road', 'Tech & Luxury'] },
          priority: { type: 'STRING', enum: ['Fuel Economy', 'Safety', 'Performance', 'Comfort', 'Features'] }
        },
        required: ['budgetMin', 'budgetMax', 'transmission', 'seatingNeeded', 'useCase', 'priority']
      }
    }
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status: ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) {
    throw new Error('Gemini API returned an empty response.');
  }

  const parsedPrefs: UserPreferences = JSON.parse(textContent);
  return parsedPrefs;
}
