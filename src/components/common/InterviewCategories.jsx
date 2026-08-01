import "../../assets/styles/InterviewCategories.css";

function InterviewCategories(){

const categories=[

"HR Interview",

"Technical",

"Coding",

"Behavioral",

"System Design",

"Company Wise",

"Aptitude",

"Group Discussion"

];

return(

<section className="category-section">

<h2>Interview Categories</h2>

<div className="category-grid">

{categories.map((category,index)=>(

<div className="category-card" key={index}>

<h3>{category}</h3>

<p>Practice AI generated interview questions.</p>

</div>

))}

</div>

</section>

);

}

export default InterviewCategories;