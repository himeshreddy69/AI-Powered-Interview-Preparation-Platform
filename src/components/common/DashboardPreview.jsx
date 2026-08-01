import "../../assets/styles/DashboardPreview.css";

function DashboardPreview(){

return(

<section className="dashboard">

<div className="dashboard-left">

<h2>Track Your Interview Performance</h2>

<p>

Monitor your communication,
technical skills,
grammar,
confidence,
and overall interview score.

</p>

<button>

View Dashboard

</button>

</div>

<div className="dashboard-right">

<div className="score-card">

<h3>Communication</h3>

<div className="progress">
<div className="progress-fill one"></div>
</div>

</div>

<div className="score-card">

<h3>Technical</h3>

<div className="progress">
<div className="progress-fill two"></div>
</div>

</div>

<div className="score-card">

<h3>Grammar</h3>

<div className="progress">
<div className="progress-fill three"></div>
</div>

</div>

<div className="score-card">

<h3>Confidence</h3>

<div className="progress">
<div className="progress-fill four"></div>
</div>

</div>

</div>

</section>

);

}

export default DashboardPreview;