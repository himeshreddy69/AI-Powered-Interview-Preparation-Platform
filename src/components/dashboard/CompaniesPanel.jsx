import { useState } from "react";

function CompaniesPanel({ onStartCompanyInterview }) {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companiesList = [
    {
      name: "Google",
      logo: "🔍",
      color: "#ea4335",
      badge: "Tier 1 FAANG",
      description: "Focus on System Design, Data Structures, Dynamic Programming, and Scalability.",
      topics: ["Graphs & Trees", "System Design", "Algorithms", "Googlyness"],
      sampleQuestion: "Design a distributed key-value store with eventual consistency."
    },
    {
      name: "Amazon",
      logo: "📦",
      color: "#ff9900",
      badge: "Tier 1 FAANG",
      description: "Heavy focus on Amazon's 16 Leadership Principles & Object-Oriented Design.",
      topics: ["Leadership Principles", "OOD", "Arrays & Hashing", "System Architecture"],
      sampleQuestion: "Describe a situation where you had to make a decision with incomplete data (Bias for Action)."
    },
    {
      name: "Microsoft",
      logo: "💻",
      color: "#00a4ef",
      badge: "Tier 1 Big Tech",
      description: "Focus on Operating Systems, Recursion, Pointers, and Team Communication.",
      topics: ["Data Structures", "Web Development", "System Fundamentals", "Collaboration"],
      sampleQuestion: "How do you handle memory allocation and pointers in high-concurrency systems?"
    },
    {
      name: "Meta",
      logo: "♾️",
      color: "#0668e1",
      badge: "Tier 1 FAANG",
      description: "Fast-paced coding rounds focusing on binary trees, graph algorithms, and product architecture.",
      topics: ["Binary Trees", "BFS / DFS", "React & Frontend Architecture", "Product Design"],
      sampleQuestion: "Write a function to serialize and deserialize a binary tree."
    },
    {
      name: "Adobe",
      logo: "🅰️",
      color: "#ff0000",
      badge: "Creative Tech",
      description: "Focus on graphics algorithms, C++/JavaScript internals, and UI performance.",
      topics: ["DOM & Canvas", "C++ / JS Internals", "Problem Solving", "UI Architecture"],
      sampleQuestion: "Explain how browser render trees work and how to optimize canvas redraws."
    },
    {
      name: "Apple",
      logo: "🍎",
      color: "#a2aaad",
      badge: "Hardware & Software",
      description: "Focus on clean architecture, low-level optimization, and user experience excellence.",
      topics: ["Swift / JS", "Performance Optimization", "Clean Code", "Design Patterns"],
      sampleQuestion: "How do you diagnose and eliminate frame drops in complex user interfaces?"
    },
    {
      name: "Netflix",
      logo: "🎬",
      color: "#e50914",
      badge: "Streaming Tech",
      description: "Senior-focused technical rounds on microservices, resilience, and Freedom & Responsibility.",
      topics: ["Microservices", "Distributed Systems", "Resilience Engineering", "Culture Fit"],
      sampleQuestion: "How would you architect a fault-tolerant video streaming CDN fallback system?"
    },
    {
      name: "TCS / Infosys",
      logo: "🏢",
      color: "#2563eb",
      badge: "IT Services Leader",
      description: "Aptitude, Core Java/Python fundamentals, SQL queries, and OOP concepts.",
      topics: ["Core Java / Python", "SQL & Relational Databases", "OOP Concepts", "Aptitude"],
      sampleQuestion: "Write an optimized SQL query to find the Nth highest salary in an employee database."
    }
  ];

  const handleStartInterview = (company) => {
    if (onStartCompanyInterview) {
      /*
       * Send the whole track, not just the name. The focus areas and the
       * sample question are what make a Google round read differently from
       * an Amazon one — without them the prompt only ever saw the company
       * name buried inside the role string.
       */
      onStartCompanyInterview({
        category: "Technical Interview",
        role: `${company.name} Software Engineer`,
        companyName: company.name,
        companyFocus: company.topics,
        companyStyle: company.description,
        companySampleQuestion: company.sampleQuestion
      });
    } else {
      alert(`Starting ${company.name} Interview Session!`);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ padding: "24px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderRadius: "16px", color: "#fff" }}>
        <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#60a5fa", fontWeight: "700" }}>
          COMPANY-SPECIFIC INTERVIEW PREPARATION
        </span>
        <h1 style={{ margin: "6px 0 8px", fontSize: "26px", fontWeight: "800" }}>Top Company Interview Tracks</h1>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
          Practice tailored mock interviews matching real interview formats from Google, Amazon, Microsoft, and leading tech companies.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {companiesList.map((company) => (
          <div
            key={company.name}
            style={{
              padding: "22px",
              background: "#ffffff",
              borderRadius: "14px",
              border: selectedCompany?.name === company.name ? `2px solid ${company.color}` : "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
              display: "flex",
              flexDirection: "column",
              justify: "space-between",
              transition: "transform 0.2s ease"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "28px" }}>{company.logo}</span>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>{company.name}</h3>
                </div>
                <span style={{ fontSize: "11px", background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
                  {company.badge}
                </span>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", margin: "0 0 14px" }}>
                {company.description}
              </p>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase" }}>
                  Key Interview Topics
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {company.topics.map((t, idx) => (
                    <span key={idx} style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "3px 8px", borderRadius: "6px", fontWeight: "500" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#334155", fontStyle: "italic", marginBottom: "16px" }}>
                "Sample Question: {company.sampleQuestion}"
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartInterview(company)}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "none",
                background: company.color,
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: `0 4px 12px ${company.color}33`
              }}
            >
              Start {company.name} Mock Interview →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompaniesPanel;
