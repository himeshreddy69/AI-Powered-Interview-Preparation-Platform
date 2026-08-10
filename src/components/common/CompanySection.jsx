import "../../assets/styles/CompanySection.css";

function CompanySection() {
  const companies = [
    "Google",
    "Amazon",
    "Adobe",
    "Microsoft",
    "Apple",
    "Meta",
    "Netflix",
    "TCS",
    "Infosys",
    "Accenture"
  ];

  return (
    <section className="company-section" id="companies">
      <h2>Top Interview Companies</h2>

      <div className="company-grid">
        {companies.map((company, index) => (
          <div className="company-card" key={index}>
            {company}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CompanySection;