import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const isGeminiConfigured = Boolean(apiKey && apiKey.trim() !== "");

let aiClient = null;

if (isGeminiConfigured) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("Failed to initialize Gemini AI client:", err);
  }
}

/**
 * Generate JSON response from Gemini API using gemini-2.5-flash
 */
export async function generateJSONResponse(prompt, fallbackData = null) {
  if (!aiClient || !isGeminiConfigured) {
    console.info("Using Fallback Mock AI Engine (VITE_GEMINI_API_KEY not configured or unavailable).");
    if (fallbackData) return fallbackData;
    throw new Error("Gemini API key is not configured in .env");
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response received from Gemini API");

    // Clean JSON response if wrapped in markdown code blocks
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini API Request Error:", error);
    if (fallbackData) {
      console.info("Using fallback mock data due to API error.");
      return fallbackData;
    }
    throw error;
  }
}

/**
 * Generate plain text response from Gemini API
 */
export async function generateTextResponse(prompt, fallbackText = "") {
  if (!aiClient || !isGeminiConfigured) {
    return fallbackText || "Mock AI Response: Please configure VITE_GEMINI_API_KEY for live AI responses.";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || fallbackText;
  } catch (error) {
    console.error("Gemini API Text Generation Error:", error);
    return fallbackText || "Unable to generate response at this time.";
  }
}

export default aiClient;
