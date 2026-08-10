function AboutPanel() {
  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <div style={{ padding: "28px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "16px", color: "#ffffff" }}>
        <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#60a5fa", fontWeight: "700" }}>
          ABOUT THE PLATFORM
        </span>
        <h1 style={{ margin: "6px 0 8px", fontSize: "28px", fontWeight: "800" }}>DEBIC AI Interview Coach</h1>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
          Empowering students and job seekers worldwide through intelligent, personalized mock interview practice and speech analysis.
        </p>
      </div>

      {/* Mission Card */}
      <div style={{ padding: "24px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "20px", color: "#0f172a" }}>Mission & Vision</h2>
        <p style={{ color: "#475569", lineHeight: "1.7", fontSize: "14px", margin: 0 }}>
          Interviewing is one of the most critical steps in any professional career. The <strong>AI-Powered Interview Preparation Platform</strong> is engineered to make interview practice interactive, realistic, and accessible. By scanning candidate resumes and employing Google Gemini AI, the platform simulates high-stakes technical, HR, coding, and behavioral interview environments.
        </p>
      </div>

      {/* Tech Stack Breakdown */}
      <div style={{ padding: "24px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "20px", color: "#0f172a" }}>Technology Stack</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ color: "#2563eb", fontSize: "15px", display: "block", marginBottom: "4px" }}>Frontend Framework</strong>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>React 18 · Vite · Vanilla CSS · React Router DOM</p>
          </div>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ color: "#10b981", fontSize: "15px", display: "block", marginBottom: "4px" }}>AI Engine</strong>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Google Gemini 2.5 Flash (`@google/genai` SDK)</p>
          </div>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ color: "#f59e0b", fontSize: "15px", display: "block", marginBottom: "4px" }}>Backend & Storage</strong>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Firebase Auth · Cloud Firestore · LocalStorage Fallback</p>
          </div>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ color: "#8b5cf6", fontSize: "15px", display: "block", marginBottom: "4px" }}>Parsers & Speech</strong>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>PDF.js (`pdfjs-dist`) · Web Speech API · Recharts</p>
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div style={{ padding: "24px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>Project Author</span>
          <h3 style={{ margin: "4px 0 2px", fontSize: "20px", color: "#14532d" }}>Himesh Reddy</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#15803d" }}>B.Tech CSE Student · IIIT Kottayam</p>
        </div>

        <a
          href="https://github.com/himeshreddy69"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            background: "#16a34a",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "13px",
            textDecoration: "none"
          }}
        >
          View GitHub Profile ↗
        </a>
      </div>
    </div>
  );
}

export default AboutPanel;
