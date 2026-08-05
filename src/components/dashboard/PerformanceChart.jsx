import "../../assets/styles/PerformanceChart.css";

function PerformanceChart() {

  return (

    <div className="dashboard-card">

      <h2>

        Performance

      </h2>

      <p>

        Weekly interview performance chart

        will appear here.

      </p>

      <div
        style={{
          height: "220px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#eef2ff",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      >

        📈 Chart Coming Soon

      </div>

    </div>

  );

}

export default PerformanceChart;