import { isGeminiConfigured } from "../../services/ai/gemini";
import "../../assets/styles/AiStatusBanner.css";

/**
 * Warns the user when the Gemini API key is missing.
 *
 * Without this the app silently falls back to canned sample questions and
 * generic feedback, which looks identical to real AI output — so someone could
 * practise for an hour thinking they were being scored by AI when they were not.
 */
function AiStatusBanner() {
  if (isGeminiConfigured) return null;

  return (
    <div className="ai-status-banner" role="status">
      <span className="ai-status-icon" aria-hidden="true">⚠️</span>

      <div>
        <strong>AI is not connected — you are seeing sample content.</strong>
        <p>
          Questions and feedback below come from a built-in sample set, not from
          real AI. To turn on live AI, add a{" "}
          <code>VITE_GEMINI_API_KEY</code> to your <code>.env</code> file and
          restart the dev server. You can get a free key from{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google AI Studio
          </a>.
        </p>
      </div>
    </div>
  );
}

export default AiStatusBanner;
