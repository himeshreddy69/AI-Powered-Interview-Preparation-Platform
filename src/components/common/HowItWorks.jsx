import "../../assets/styles/HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      title: "Upload Resume",
      description: "Upload your resume in PDF or DOC format."
    },
    {
      title: "AI Skill Analysis",
      description: "AI extracts your skills, experience, and key technologies."
    },
    {
      title: "Choose Interview",
      description: "Select HR, Technical, Coding, Behavioral, or Company-wise interviews."
    },
    {
      title: "Generate Questions",
      description: "AI creates personalized interview questions based on your profile."
    },
    {
      title: "Mock Interview",
      description: "Practice interviews with a timer and voice recording."
    },
    {
      title: "AI Evaluation",
      description: "Get scores for communication, confidence, grammar, and technical skills."
    },
    {
      title: "Download Report",
      description: "Download your detailed interview performance report as a PDF."
    }
  ];

  return (
    <section className="work-section" id="how-it-works">

      <h2>How It Works</h2>

      <p className="work-subtitle">
        Follow these simple steps to prepare for your dream interview.
      </p>

      <div className="steps">

        {steps.map((step, index) => (
          <div className="step-card" key={index}>

            <div className="circle">
              {index + 1}
            </div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;