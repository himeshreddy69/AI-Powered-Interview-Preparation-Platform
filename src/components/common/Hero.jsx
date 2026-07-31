function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Ace Your Next Interview with AI</h1>

        <p>
          Prepare smarter with AI-powered resume analysis,
          mock interviews, personalized interview questions,
          and performance tracking.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started
          </button>

          <button className="secondary-btn">
            Learn More
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://via.placeholder.com/500x350"
          alt="AI Interview"
        />
      </div>
    </section>
  );
}

export default Hero;