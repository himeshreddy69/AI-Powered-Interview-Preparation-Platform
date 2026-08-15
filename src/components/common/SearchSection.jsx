import { useState } from "react";
import { scrollToSection } from "../../utils/scrollToSection";
import "../../assets/styles/SearchSection.css";

/**
 * Filters the company list below. `onSearch` is owned by Home so this box
 * and CompanySection stay in step.
 */
function SearchSection({ onSearch }) {
  const [term, setTerm] = useState("");

  const applySearch = (value) => {
    setTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSearch) onSearch(term);

    // Jump to the results so the filtering is visible.
    scrollToSection("companies");
  };

  return (
    <section className="search-section">

      <h2>Find Your Dream Interview</h2>

      <p>
        Search interview preparation by company name
      </p>

      <form className="search-box" onSubmit={handleSubmit} role="search">

        <input
          type="text"
          value={term}
          onChange={(event) => applySearch(event.target.value)}
          placeholder="Search Google, Amazon, Adobe..."
          aria-label="Search companies"
        />

        <button type="submit">Search</button>

      </form>

    </section>
  );
}

export default SearchSection;
