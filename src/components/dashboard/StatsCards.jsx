import "../../assets/styles/StatsCards.css";

function StatsCards() {

  return (

    <div className="dashboard-card">

      <h2>Your Statistics</h2>

      <div className="stats-grid">

        <div>

          <h3>12</h3>

          <p>Interviews</p>

        </div>

        <div>

          <h3>87%</h3>

          <p>Average Score</p>

        </div>

        <div>

          <h3>6</h3>

          <p>Certificates</p>

        </div>

        <div>

          <h3>15</h3>

          <p>Skills</p>

        </div>

      </div>

    </div>

  );

}

export default StatsCards;