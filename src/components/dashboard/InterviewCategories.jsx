import "../../assets/styles/InterviewCategories.css";

function InterviewCategories() {

  const categories = [

    "HR",

    "Technical",

    "Coding",

    "Behavioral",

    "Company Specific"

  ];



  return (

    <div className="dashboard-card">

      <h2>

        Interview Categories

      </h2>

      <div className="category-grid">

        {

          categories.map((category) => (

            <button

              key={category}

              className="dashboard-btn"

            >

              {category}

            </button>

          ))

        }

      </div>

    </div>

  );

}

export default InterviewCategories;