import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const isGeminiConfigured =
  Boolean(apiKey && apiKey.trim() !== "");

let aiClient = null;

if (isGeminiConfigured) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
    });
  } catch (error) {
    console.warn(
      "Failed to initialize Gemini AI client:",
      error
    );
  }
}

/* =========================================
   JSON RESPONSE
========================================= */

export async function generateJSONResponse(
  prompt,
  fallbackData = null
) {
  if (!aiClient || !isGeminiConfigured) {
    console.warn(
      "Gemini API key not configured. Using fallback evaluation."
    );

    if (fallbackData !== null) {
      return fallbackData;
    }

    throw new Error(
      "Gemini API key is not configured."
    );
  }

  try {
    const response = await Promise.race([
      aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      }),

      new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Gemini request timed out."
            )
          );
        }, 10000);
      }),
    ]);

    const text = response?.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    let cleanedText = text.trim();

    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json/i, "")
        .replace(/```$/i, "")
        .trim();
    }

    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();
    }

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "Gemini returned invalid JSON:",
        cleanedText
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }
  } catch (error) {
    console.error(
      "Gemini API Request Error:",
      error
    );

    if (fallbackData !== null) {
      console.warn(
        "Using fallback data instead."
      );

      return fallbackData;
    }

    throw error;
  }
}

/* =========================================
   TEXT RESPONSE
========================================= */

export async function generateTextResponse(
  prompt,
  fallbackText = ""
) {
  if (!aiClient || !isGeminiConfigured) {
    console.warn(
      "Gemini API key not configured. Using fallback text."
    );

    return (
      fallbackText ||
      "AI service is not configured."
    );
  }

  try {
    const response = await Promise.race([
      aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      }),

      new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Gemini text request timed out."
            )
          );
        }, 10000);
      }),
    ]);

    return (
      response?.text ||
      fallbackText ||
      "Unable to generate AI response."
    );
  } catch (error) {
    console.error(
      "Gemini API Text Generation Error:",
      error
    );

    return (
      fallbackText ||
      "Unable to generate AI response."
    );
  }
}

export default aiClient;