import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { parseResumeFile } from "../../utils/resumeParser";
import { generateJSONResponse } from "../../services/ai/gemini";
import { RESUME_EXTRACTION_PROMPT } from "../../services/ai/promptTemplates";
import {
  getUserResume,
  saveUserResume
} from "../../services/supabase/resumes";
import { uploadResume } from "../../services/supabase/storage";
import AiStatusBanner from "../common/AiStatusBanner";
import "../../assets/styles/ResumeCard.css";

function ResumeCard() {
  const { user } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    async function loadResume() {
      if (!user?.uid) return;

      const data = await getUserResume(user.uid);

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
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10 MB.");
      event.target.value = "";
      return;
    }

    if (!user?.uid) {
      alert("User not logged in.");
      event.target.value = "";
      return;
    }

    let uploadSuccessful = false;
    let aiAnalysisSuccessful = false;

    try {
      setUploading(true);
      setUploadComplete(false);
      setAnalysisComplete(false);

      // STEP 1: UPLOAD TO SUPABASE
      setStatusMsg("Uploading resume to secure storage...");

      const storageData = await uploadResume(file, user.uid);

      uploadSuccessful = true;
      setUploadComplete(true);

      // STEP 2: READ RESUME
      setStatusMsg("✅ Resume uploaded! Reading file content...");

      const rawText = await parseResumeFile(file);

      // STEP 3: AI ANALYSIS
      setStatusMsg(
        "✅ Resume uploaded! AI is analyzing your resume..."
      );

      const fallbackInfo = {
        fileName: file.name,
        name: user?.displayName || "Candidate",
        jobTitle: "Software Developer",
        experienceLevel: "Mid Level",
        skills: [
          "JavaScript",
          "React",
          "Node.js",
          "SQL",
          "Problem Solving"
        ],
        summary:
          "Motivated software development professional with experience building modern web applications.",
        rawText: rawText.substring(0, 2000)
      };

      let parsedProfile = fallbackInfo;

      try {
        const prompt = RESUME_EXTRACTION_PROMPT(
          rawText.substring(0, 4000)
        );

        const aiResult = await Promise.race([
          generateJSONResponse(prompt, fallbackInfo),

          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("AI analysis timed out")),
              20000
            )
          )
        ]);

        parsedProfile = {
          fileName: file.name,
          rawText: rawText.substring(0, 3000),
          ...aiResult
        };

        aiAnalysisSuccessful = true;
        setAnalysisComplete(true);

      } catch (err) {
        console.warn("AI extraction fallback used:", err);
      }

      // STEP 4: SAVE TO FIRESTORE
      const finalResumeData = {
        ...parsedProfile,
        storagePath: storageData.path || "",
        storageUrl: storageData.publicUrl || "",
        uploadedAt: new Date().toISOString()
      };

      await saveUserResume(user.uid, finalResumeData);

      // STEP 5: UPDATE UI
      setResumeData(finalResumeData);

      if (aiAnalysisSuccessful) {
        setStatusMsg(
          "🎉 Resume uploaded, analyzed & saved successfully!"
        );
      } else {
        setStatusMsg(
          "✅ Resume uploaded & saved successfully. AI analysis used fallback data."
        );
      }

    } catch (error) {
      console.error("Resume upload error:", error);

      if (uploadSuccessful) {
        // Pass the reason through when we have a useful one (for example an
        // image-only PDF with no text layer) so the user knows what to fix.
        setStatusMsg(
          error?.message
            ? `⚠️ Resume uploaded, but it could not be read. ${error.message}`
            : "⚠️ Resume uploaded successfully, but processing could not be completed."
        );
      } else {
        setStatusMsg(
          "❌ Resume upload failed. Please try again."
        );
      }

    } finally {
      setUploading(false);

      setTimeout(() => {
        setStatusMsg("");
        setUploadComplete(false);
        setAnalysisComplete(false);
      }, 6000);

      event.target.value = "";
    }
  };

  return (
    <section className="dashboard-card resume-card">

      <div className="resume-header">
        <div>
          <span className="resume-label">
            AI RESUME PARSER
          </span>

          <h2>Resume Profile</h2>
        </div>

        <div className="resume-icon">
          📄
        </div>
      </div>

      <AiStatusBanner />

      {resumeData ? (
        <div
          className="resume-profile-details"
          style={{ marginTop: "16px" }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <strong
                style={{
                  fontSize: "16px",
                  color: "#0f172a"
                }}
              >
                {resumeData.jobTitle || "Candidate"}
              </strong>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b"
                }}
              >
                {resumeData.experienceLevel ||
                  "Tech Professional"}
              </div>
            </div>

            <span
              style={{
                fontSize: "11px",
                background: "#e0e7ff",
                color: "#3730a3",
                padding: "4px 8px",
                borderRadius: "12px"
              }}
            >
              {resumeData.fileName ||
                "Uploaded Resume"}
            </span>
          </div>

          {resumeData.summary && (
            <p
              className="resume-description"
              style={{
                marginTop: "10px",
                fontSize: "13px"
              }}
            >
              "{resumeData.summary}"
            </p>
          )}

          <div style={{ marginTop: "12px" }}>

            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#475569",
                marginBottom: "6px",
                textTransform: "uppercase"
              }}
            >
              Extracted Skills
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px"
              }}
            >
              {(resumeData.skills || [
                "JavaScript",
                "React",
                "Node.js"
              ]).map((skill, idx) => (
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
          Upload your latest PDF or TXT resume to receive
          AI-generated interview questions and personalized
          feedback tailored to your skills.
        </p>
      )}

      {statusMsg && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px 14px",
            background: uploadComplete
              ? "#ecfdf5"
              : "#eff6ff",
            border: uploadComplete
              ? "1px solid #a7f3d0"
              : "1px solid #bfdbfe",
            borderRadius: "10px",
            fontSize: "13px",
            color: uploadComplete
              ? "#047857"
              : "#2563eb",
            fontWeight: "600",
            textAlign: "center"
          }}
        >
          {statusMsg}
        </div>
      )}

      <label className="resume-upload-btn">

        <span>
          {uploading
            ? "Uploading & Analyzing..."
            : resumeData
            ? "Update Resume"
            : "Upload Resume"}
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