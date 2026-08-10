import "../../assets/styles/InterviewCategories.css";

function InterviewCategories({ onSelectCategory }) {
  const categories = [
    { name: "Technical Interview", icon: "💻" },
    { name: "HR Interview", icon: "👤" },
    { name: "Coding Interview", icon: "⌨️" },
    { name: "Behavioral Interview", icon: "🧠" }
  ];

  return (
    <div className="dashboard-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", color: "#2563eb", display: "block", marginBottom: "4px" }}>
            PRACTICE MODES
          </span>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Interview Categories</h2>
        </div>
      </div>

      <div className="category-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {categories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className="dashboard-btn"
            onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            style={{
              padding: "14px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              color: "#0f172a"
            }}
          >
            <span style={{ fontSize: "18px" }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default InterviewCategories;