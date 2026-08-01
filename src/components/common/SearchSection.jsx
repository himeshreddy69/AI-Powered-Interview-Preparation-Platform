import "../../assets/styles/SearchSection.css";

function SearchSection() {
  return (
    <section className="search-section">

      <h2>Find Your Dream Interview</h2>

      <p>
        Search interview preparation by company name
      </p>

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Google, Amazon, Adobe..."
        />

        <button>Search</button>

      </div>

    </section>
  );
}

export default SearchSection;