import "../../assets/styles/RecentInterviews.css";

function RecentInterviews() {

  const interviews = [

    {
      company: "Google",
      score: "90%"
    },

    {
      company: "Amazon",
      score: "85%"
    },

    {
      company: "Microsoft",
      score: "88%"
    }

  ];



  return (

    <div className="dashboard-card">

      <h2>

        Recent Interviews

      </h2>

      <ul className="interview-list">

        {

          interviews.map((item, index) => (

            <li key={index}>

              <span>

                {item.company}

              </span>

              <strong>

                {item.score}

              </strong>

            </li>

          ))

        }

      </ul>

    </div>

  );

}

export default RecentInterviews;