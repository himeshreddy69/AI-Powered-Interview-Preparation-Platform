import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { generateInterviewQuestions } from "../../services/ai/interviewGenerator";
import { evaluateInterviewSession } from "../../services/ai/feedbackGenerator";
import { getUserResume, saveInterviewResult } from "../../services/firebase/firestore";
import "../../assets/styles/InterviewPanel.css";

function InterviewPanel({ onCompleteSession }) {
  const { user } = useAuth();

  // Setup state
  const [selectedType, setSelectedType] = useState("Technical Interview");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [questionCount, setQuestionCount] = useState(5);
  const [resumeData, setResumeData] = useState(null);

  // Flow control states
  const [stage, setStage] = useState("setup"); // "setup" | "generating" | "interview" | "evaluating"
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins total
  const [showHint, setShowHint] = useState(false);

  const interviewTypes = [
    {
      name: "Technical Interview",
      icon: "💻",
      description: "Test core architecture, data structures, & domain knowledge.",
    },
    {
      name: "HR Interview",
      icon: "👤",
      description: "Practice communication, career motivation, & soft skills.",
    },
    {
      name: "Coding Interview",
      icon: "⌨️",
      description: "Solve algorithmic challenges and state complexities.",
    },
    {
      name: "Behavioral Interview",
      icon: "🧠",
      description: "Master STAR-formatted responses for real workplace scenarios.",
    },
  ];

  // Load user resume profile on mount
  useEffect(() => {
    async function loadResume() {
      const data = await getUserResume(user?.uid);
      if (data) {
        setResumeData(data);
        if (data.jobTitle) {
          setTargetRole(data.jobTitle);
        }
      }
    }
    loadResume();
  }, [user]);

  // Timer countdown hook during live interview
  useEffect(() => {
    let timer = null;
    if (stage === "interview" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stage, timeLeft]);

  // Setup Web Speech API for voice recording
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const currentQId = questions[currentIdx]?.id || currentIdx + 1;
        setUserAnswers((prev) => ({
          ...prev,
          [currentQId]: (prev[currentQId] ? prev[currentQId] + " " : "") + transcript
        }));
      };

      rec.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [questions, currentIdx]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. You can type your answers directly.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStartInterview = async () => {
    setStage("generating");
    try {
      const generated = await generateInterviewQuestions({
        category: selectedType,
        role: targetRole,
        resumeText: resumeData?.rawText || "",
        questionCount: Number(questionCount)
      });
      setQuestions(generated);
      setCurrentIdx(0);
      setUserAnswers({});
      setTimeLeft(questionCount * 180); // 3 mins per question
      setStage("interview");
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions. Starting default session.");
      setStage("setup");
    }
  };

  const handleAnswerChange = (text) => {
    const currentQId = questions[currentIdx]?.id || currentIdx + 1;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQId]: text
    }));
  };

  const handleNext = () => {
    setShowHint(false);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitInterview = async () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStage("evaluating");

    const qnaList = questions.map((q) => ({
      id: q.id,
      question: q.question,
      hints: q.hints || [],
      userAnswer: userAnswers[q.id] || ""
    }));

    try {
      const evalResult = await evaluateInterviewSession({
        category: selectedType,
        role: targetRole,
        qnaList
      });

      const fullResultData = {
        category: selectedType,
        role: targetRole,
        questionsCount: questions.length,
        ...evalResult,
        qnaList
      };

      // Save result locally & to Firestore
      await saveInterviewResult(user?.uid, fullResultData);

      if (onCompleteSession) {
        onCompleteSession(fullResultData);
      } else {
        setStage("setup");
        alert(`Session complete! You scored ${evalResult.overallScore}%. Navigate to the Results tab to view your full evaluation report.`);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Evaluation finished with default scoring.");
      setStage("setup");
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 1. GENERATING LOADING STAGE
  if (stage === "generating") {
    return (
      <div className="interview-screen" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>🤖</div>
        <h2 style={{ fontSize: "24px", color: "#0f172a", marginBottom: "10px" }}>
          Generating Personalized Questions...
        </h2>
        <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 30px" }}>
          Gemini AI is scanning your {resumeData ? "uploaded resume and " : ""}
          target role (<strong>{targetRole}</strong>) to craft high-impact {selectedType} questions.
        </p>
        <div style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // 2. EVALUATING LOADING STAGE
  if (stage === "evaluating") {
    return (
      <div className="interview-screen" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚡</div>
        <h2 style={{ fontSize: "24px", color: "#0f172a", marginBottom: "10px" }}>
          Evaluating Your Responses...
        </h2>
        <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 30px" }}>
          Analyzing technical accuracy, communication style, and problem-solving metrics across all answers.
        </p>
        <div style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // 3. LIVE INTERVIEW SESSION STAGE
  if (stage === "interview") {
    const currentQ = questions[currentIdx] || { question: "Loading..." };
    const currentQId = currentQ.id || currentIdx + 1;
    const currentAnswer = userAnswers[currentQId] || "";

    return (
      <div className="interview-screen">
        <div className="interview-screen-header">
          <div>
            <span>LIVE AI MOCK INTERVIEW</span>
            <h1>{selectedType}</h1>
            <p>Target Role: <strong>{targetRole}</strong></p>
          </div>

          <div className="interview-timer" style={{ color: timeLeft < 180 ? "#dc2626" : "#2563eb", borderColor: timeLeft < 180 ? "#fca5a5" : "#dbeafe" }}>
            ⏱️ {formatTimer(timeLeft)}
          </div>
        </div>

        <div className="question-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="question-number">
              QUESTION {currentIdx + 1} OF {questions.length}
            </span>
            {currentQ.difficulty && (
              <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "3px 10px", borderRadius: "12px", color: "#475569", fontWeight: "600" }}>
                {currentQ.difficulty}
              </span>
            )}
          </div>

          <h2>{currentQ.question}</h2>

          {currentQ.hints && currentQ.hints.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                style={{ background: "none", border: "none", color: "#2563eb", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: 0 }}
              >
                💡 {showHint ? "Hide Hint" : "Show Answer Hint"}
              </button>
              {showHint && (
                <div style={{ marginTop: "8px", padding: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "13px", color: "#166534" }}>
                  {currentQ.hints.join(" ")}
                </div>
              )}
            </div>
          )}

          <div style={{ position: "relative" }}>
            <textarea
              placeholder="Type or speak your answer here..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: isRecording ? "1px solid #ef4444" : "1px solid #cbd5e1",
                  background: isRecording ? "#fef2f2" : "#ffffff",
                  color: isRecording ? "#dc2626" : "#475569",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <span>{isRecording ? "🎙️ Recording... (Click to stop)" : "🎤 Speak Answer"}</span>
              </button>

              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>

          <div className="question-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              style={{ opacity: currentIdx === 0 ? 0.5 : 1, cursor: currentIdx === 0 ? "not-allowed" : "pointer" }}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
                  setStage("setup");
                }
              }}
              style={{ color: "#dc2626", borderColor: "#fca5a5" }}
            >
              Exit
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                className="start-interview-btn"
                onClick={handleNext}
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                className="start-interview-btn"
                onClick={handleSubmitInterview}
                style={{ background: "#16a34a" }}
              >
                Submit & Finish Interview ✓
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. SETUP STAGE (DEFAULT)
  return (
    <section className="interview-panel">
      <div className="interview-panel-header">
        <span>AI MOCK INTERVIEW GENERATOR</span>
        <h1>Start an AI Mock Interview</h1>
        <p>
          Select an interview category, specify your target role, and practice with AI-generated questions.
        </p>
      </div>

      {resumeData && (
        <div style={{ marginBottom: "20px", padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "13px", color: "#166534" }}>
            <strong>Resume Connected:</strong> AI will tailor questions matching your profile as <strong>{resumeData.jobTitle}</strong>.
          </div>
          <span style={{ fontSize: "12px", background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>
            {resumeData.skills?.length || 0} Skills Loaded
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
            Target Job Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Engineer, Data Scientist"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
            Number of Questions
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#ffffff", boxSizing: "border-box" }}
          >
            <option value={3}>3 Questions (Quick Practice)</option>
            <option value={5}>5 Questions (Standard Session)</option>
            <option value={10}>10 Questions (Comprehensive Assessment)</option>
          </select>
        </div>
      </div>

      <div className="interview-type-grid">
        {interviewTypes.map((type) => (
          <button
            type="button"
            key={type.name}
            className={`interview-type-card ${selectedType === type.name ? "selected" : ""}`}
            onClick={() => setSelectedType(type.name)}
          >
            <div className="interview-type-icon">{type.icon}</div>
            <h3>{type.name}</h3>
            <p>{type.description}</p>
          </button>
        ))}
      </div>

      <div className="interview-start-area">
        <div>
          <p>Selected Mode: <strong>{selectedType}</strong></p>
          <p style={{ fontSize: "12px", color: "#94a3b8" }}>Role: {targetRole} · {questionCount} Questions</p>
        </div>

        <button
          type="button"
          className="start-interview-btn"
          onClick={handleStartInterview}
        >
          Start AI Interview →
        </button>
      </div>
    </section>
  );
}

export default InterviewPanel;