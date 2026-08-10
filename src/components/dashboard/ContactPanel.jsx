import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ContactPanel() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "General Feedback",
    rating: "5",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      alert("Please enter a message before sending.");
      return;
    }

    // Persist feedback locally
    const existing = JSON.parse(localStorage.getItem("user_feedbacks") || "[]");
    existing.push({
      ...formData,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("user_feedbacks", JSON.stringify(existing));

    setSubmitted(true);
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Banner */}
      <div style={{ padding: "24px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "16px", color: "#ffffff" }}>
        <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#60a5fa", fontWeight: "700" }}>
          FEEDBACK & SUPPORT
        </span>
        <h1 style={{ margin: "6px 0 8px", fontSize: "26px", fontWeight: "800" }}>Contact Us</h1>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
          Have questions, feature requests, or feedback on your AI interview performance? Reach out directly!
        </p>
      </div>

      {submitted ? (
        <div style={{ padding: "40px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h2 style={{ fontSize: "22px", color: "#0f172a", marginBottom: "8px" }}>Message Sent Successfully!</h2>
          <p style={{ color: "#64748b", maxWidth: "450px", margin: "0 auto 24px", fontSize: "14px" }}>
            Thank you for your feedback! Our AI engineering team continuously uses user input to refine interview question accuracy and scoring metrics.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            style={{ padding: "10px 20px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ padding: "28px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Topic / Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#ffffff", boxSizing: "border-box" }}
              >
                <option value="General Feedback">General Feedback</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Company Track Suggestion">Company Track Suggestion</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                Platform Experience Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#ffffff", boxSizing: "border-box" }}
              >
                <option value="5">⭐⭐⭐⭐⭐ 5/5 - Excellent</option>
                <option value="4">⭐⭐⭐⭐ 4/5 - Good</option>
                <option value="3">⭐⭐⭐ 3/5 - Average</option>
                <option value="2">⭐⭐ 2/5 - Needs Improvement</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
              Your Message
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you think or describe your question..."
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Send Feedback & Message →
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactPanel;
