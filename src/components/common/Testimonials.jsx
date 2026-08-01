import "../../assets/styles/Testimonials.css";

function Testimonials() {
  const reviews = [
    {
      name: "Rahul Sharma",
      company: "Google",
      review:
        "The AI mock interviews helped me gain confidence before my Google interview.",
    },
    {
      name: "Priya Reddy",
      company: "Amazon",
      review:
        "Resume analysis and AI feedback improved my interview performance a lot.",
    },
    {
      name: "Karthik Kumar",
      company: "Adobe",
      review:
        "One of the best interview preparation platforms I've used.",
    },
  ];

  return (
    <section className="testimonial-section">

      <h2>Student Success Stories</h2>

      <p>
        Thousands of students improved their interview skills using DEBIC.
      </p>

      <div className="testimonial-grid">

        {reviews.map((review, index) => (
          <div className="testimonial-card" key={index}>

            <h3>{review.name}</h3>

            <span>{review.company}</span>

            <p>"{review.review}"</p>

            <div className="stars">⭐⭐⭐⭐⭐</div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Testimonials;
