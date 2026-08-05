import { useState } from "react";
import { getAuth } from "firebase/auth";
import "../../assets/styles/ResumeCard.css";
import { uploadResume } from "../../services/supabase/storage";

function ResumeCard() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10 MB.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      setUploading(true);

      const resumePath = await uploadResume(file, user.uid);

      console.log("Resume Uploaded:", resumePath);

      alert("Resume uploaded successfully!");

      // Next step:
      // Save resumePath in Firestore for this user

    } catch (error) {
      console.error(error);
      alert(error.message || "Resume upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h2>Resume</h2>

      <p>
        Upload your latest resume to receive AI-generated interview questions.
      </p>

      <label className="dashboard-btn">
        {uploading ? "Uploading..." : "Upload Resume"}

        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          hidden
        />
      </label>
    </div>
  );
}

export default ResumeCard;