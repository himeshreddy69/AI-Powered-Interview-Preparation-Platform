function FeaturesPanel({ onNavigate }) {
  const featureCards = [
    {
      title: "AI Resume Skill Extraction",
      icon: "📄",
      description: "Upload PDF or TXT resumes. AI automatically parses your work experience, tech stack, and job title to personalize every interview session.",
      badge: "Gemini AI",
      actionSection: "resume"
    },
    {
      title: "Speech-to-Text Voice Recording",
      icon: "🎤",
      description: "Practice answering questions aloud using built-in Web Speech recognition. Speaks like a real live technical interview.",
      badge: "Web Speech API",
      actionSection: "interview"
    },
    {
      title: "Tailored Question Generation",
      icon: "🤖",
      description: "Generates role-specific questions for HR, Technical, Coding, and Behavioral modes with customized difficulty levels.",
      badge: "Gemini 2.5 Flash",
      actionSection: "interview"
    },
    {
      title: "Detailed AI Scoring & Feedback",
      icon: "📊",
      description: "Receive objective scores (0-100%) broken down by Technical Depth, Communication Clarity, and Problem Solving capability.",
      badge: "AI Evaluator",
      actionSection: "results"
    },
    {
      title: "Ideal Model Answers",
      icon: "💡",
      description: "Compare your submitted answer directly with AI-generated high-scoring model responses to learn key concepts fast.",
      badge: "Learning Engine",
      actionSection: "results"
    },
    {
      title: "Performance History Telemetry",
      icon: "📈",
      description: "Track your score improvement trends over time with visual area charts powered by Recharts.",
      badge: "Analytics",
      actionSection: "dashboard"
    }
  ];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Banner */}
      <div style={{ padding: "24px", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", borderRadius: "16px", color: "#ffffff" }}>
        <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#bfdbfe", fontWeight: "700" }}>
          PLATFORM CAPABILITIES
        </span>
        <h1 style={{ margin: "6px 0 8px", fontSize: "26px", fontWeight: "800" }}>Platform Features</h1>
        <p style={{ margin: 0, color: "#dbeafe", fontSize: "14px" }}>
          Explore all the AI tools, speech recognition capabilities, and analytics engines powering your interview preparation.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {featureCards.map((feat, idx) => (
          <div
            key={idx}
            style={{
              padding: "24px",
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ fontSize: "32px" }}>{feat.icon}</div>
                <span style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
                  {feat.badge}
                </span>
              </div>

              <h3 style={{ margin: "0 0 8px", fontSize: "17px", color: "#0f172a" }}>{feat.title}</h3>
              <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
                {feat.description}
              </p>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate(feat.actionSection)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#2563eb",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Try Feature →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesPanel;
