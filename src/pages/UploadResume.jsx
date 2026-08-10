import React from "react";
import "./UploadResume.css";

const UploadResume = () => {
  return (
    <div className="resume-card">
      <h2>Resume</h2>

      <p className="resume-description">
        Upload your latest resume to receive AI-generated interview questions.
      </p>

      <button className="upload-btn">
        Upload Resume
      </button>
    </div>
  );
};

export default UploadResume;