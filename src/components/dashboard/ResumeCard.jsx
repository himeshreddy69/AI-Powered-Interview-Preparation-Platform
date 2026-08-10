import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { parseResumeFile } from "../../utils/resumeParser";
import { generateJSONResponse } from "../../services/ai/gemini";
import { RESUME_EXTRACTION_PROMPT } from "../../services/ai/promptTemplates";
import { getUserResume, saveUserResume } from "../../services/firebase/firestore";
import "../../assets/styles/ResumeCard.css";

function ResumeCard() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    async function loadResume() {
      const data = await getUserResume(user?.uid);
      if (data) {
        setResumeData(data);
      }
    }
    loadResume();
  }, [user]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pdf") && !fileName.endsWith(".txt")) {
      alert("Please upload a PDF or TXT resume file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10 MB.");
      return;
    }

    try {
      setUploading(true);
      setStatusMsg("Reading file content...");

      const rawText = await parseResumeFile(file);

      setStatusMsg("AI is analyzing your resume & skills...");

      const fallbackInfo = {
        fileName: file.name,
        name: user?.displayName || "Candidate",
        jobTitle: "Software Developer",
        experienceLevel: "Mid Level",
        skills: ["JavaScript", "React", "Node.js", "SQL", "Problem Solving"],
        summary: "Motivated software development professional with experience building modern web applications.",
        rawText: rawText.substring(0, 2000),
      };

      let parsedProfile = fallbackInfo;

      try {
        const prompt = RESUME_EXTRACTION_PROMPT(rawText.substring(0, 4000));
        const aiExtracted = await generateJSONResponse(prompt, fallbackInfo);
        parsedProfile = {
          fileName: file.name,
          rawText: rawText.substring(0, 3000),
          ...aiExtracted,
        };
      } catch (err) {
        console.warn("AI extraction fallback used:", err);
      }

      await saveUserResume(user?.uid, parsedProfile);
      setResumeData(parsedProfile);
      setStatusMsg("Resume analyzed & saved!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to process resume.");
    } finally {
      setUploading(false);
      setTimeout(() => setStatusMsg(""), 4000);
    }
  };

  return (
    <section className="dashboard-card resume-card">
      <div className="resume-header">
        <div>
          <span className="resume-label">AI RESUME PARSER</span>
          <h2>Resume Profile</h2>
        </div>

        <div className="resume-icon">
          📄
        </div>
      </div>

      {resumeData ? (
        <div className="resume-profile-details" style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: "16px", color: "#0f172a" }}>{resumeData.jobTitle || "Candidate"}</strong>
              <div style={{ fontSize: "12px", color: "#64748b" }}>{resumeData.experienceLevel || "Tech Professional"}</div>
            </div>
            <span style={{ fontSize: "11px", background: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: "12px" }}>
              {resumeData.fileName || "Uploaded Resume"}
            </span>
          </div>

          {resumeData.summary && (
            <p className="resume-description" style={{ marginTop: "10px", fontSize: "13px" }}>
              "{resumeData.summary}"
            </p>
          )}

          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "6px", textTransform: "uppercase" }}>
              Extracted Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {(resumeData.skills || ["JavaScript", "React", "Node.js"]).map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "12px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontWeight: "500"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="resume-description">
          Upload your latest PDF or TXT resume to receive AI-generated interview
          questions and personalized feedback tailored to your skills.
        </p>
      )}

      {statusMsg && (
        <div style={{ marginTop: "12px", fontSize: "12px", color: "#2563eb", fontWeight: "600", textAlign: "center" }}>
          ⚡ {statusMsg}
        </div>
      )}

      <label className="resume-upload-btn">
        <span>
          {uploading ? "Analyzing Resume..." : resumeData ? "Update Resume" : "Upload Resume"}
        </span>

        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleUpload}
          hidden
          disabled={uploading}
        />
      </label>

      <p className="resume-note">
        PDF or TXT files · Maximum size 10 MB
      </p>
    </section>
  );
}

export default ResumeCard;