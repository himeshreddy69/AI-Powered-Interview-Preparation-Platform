import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const isGeminiConfigured =
  Boolean(apiKey && apiKey.trim() !== "");

/*
 * Model choice.
 *
 * The app used to hardcode "gemini-2.5-flash". That model now returns
 * 404 "no longer available to new users", so a brand new API key could
 * never reach it and every AI call silently fell back to sample data.
 *
 * These are tried in order. Flash models are fast and cheap, which suits
 * question generation and answer scoring. The extras give us somewhere to
 * go when a model is temporarily overloaded (503), which does happen.
 */
const MODELS = [
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3-flash-preview",
];

const REQUEST_TIMEOUT_MS = 20000;

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

/**
 * Call the API, moving to the next model if one is unavailable or busy.
 * Anything else (bad key, bad prompt) throws straight away — retrying
 * those on another model would just waste time.
 */
async function callWithFallback(request) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      return await Promise.race([
        aiClient.models.generateContent({ ...request, model }),

        new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Gemini request timed out.")),
            REQUEST_TIMEOUT_MS
          );
        }),
      ]);
    } catch (error) {
      lastError = error;

      const status = error?.status ?? error?.code;
      const message = String(error?.message || "");
      const worthRetrying =
        status === 404 ||
        status === 429 ||
        status === 503 ||
        /not found|no longer available|overloaded|high demand|timed out/i.test(
          message
        );

      if (!worthRetrying) throw error;

      console.warn(`Gemini model "${model}" unavailable, trying next.`);
    }
  }

  throw lastError || new Error("No Gemini model was available.");
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
    const response = await callWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

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
    const response = await callWithFallback({
      contents: prompt,
    });

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