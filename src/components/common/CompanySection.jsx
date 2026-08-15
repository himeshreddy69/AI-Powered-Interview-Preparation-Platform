import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/CompanySection.css";

const COMPANIES = [
  "Google",
  "Amazon",
  "Adobe",
  "Microsoft",
  "Apple",
  "Meta",
  "Netflix",
  "TCS",
  "Infosys",
  "Accenture",
];

function CompanySection({ searchTerm = "" }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const query = searchTerm.trim().toLowerCase();
  const visible = query
    ? COMPANIES.filter((name) => name.toLowerCase().includes(query))
    : COMPANIES;

  const handleSelect = (company) => {
    if (!user) {
      navigate("/register");
      return;
    }
    navigate("/dashboard", {
      state: { category: "Technical", company },
    });
  };

  return (
    <section className="company-section" id="companies">
      <h2>Top Interview Companies</h2>

      {visible.length === 0 ? (
        <p className="company-empty">
          No company matches “{searchTerm}”. Try Google, Amazon or Microsoft.
        </p>
      ) : (
        <div className="company-grid">
          {visible.map((company) => (
            <button
              type="button"
              className="company-card"
              key={company}
              onClick={() => handleSelect(company)}
            >
              {company}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default CompanySection;
