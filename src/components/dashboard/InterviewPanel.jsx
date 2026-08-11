import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { generateInterviewQuestions } from "../../services/ai/interviewGenerator";
import { evaluateInterviewSession } from "../../services/ai/feedbackGenerator";
import { getUserResume } from "../../services/firebase/firestore";
import "../../assets/styles/InterviewPanel.css";

function InterviewPanel({ onCompleteSession }) {
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState("Technical Interview");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [questionCount, setQuestionCount] = useState(5);
  const [resumeData, setResumeData] = useState(null);

  const [stage, setStage] = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(900);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const interviewTypes = [
    {
      name: "Technical Interview",
      icon: "💻",
      description:
        "Test core architecture, data structures, & domain knowledge.",
    },
    {
      name: "HR Interview",
      icon: "👤",
      description:
        "Practice communication, career motivation, & soft skills.",
    },
    {
      name: "Coding Interview",
      icon: "⌨️",
      description:
        "Solve algorithmic challenges and state complexities.",
    },
    {
      name: "Behavioral Interview",
      icon: "🧠",
      description:
        "Master STAR-formatted responses for real workplace scenarios.",
    },
  ];

  /* =========================
     LOAD RESUME
  ========================= */

  useEffect(() => {
    async function loadResume() {
      if (!user?.uid) return;

      try {
        const data = await getUserResume(user.uid);

        if (data) {
          setResumeData(data);

          if (data.jobTitle) {
            setTargetRole(data.jobTitle);
          }
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
      }
    }

    loadResume();
  }, [user]);

  /* =========================
     TIMER
  ========================= */

  useEffect(() => {
    if (stage !== "interview" || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  /* =========================
     AUTO SUBMIT WHEN TIMER ENDS
  ========================= */

  useEffect(() => {
    if (
      stage === "interview" &&
      timeLeft === 0 &&
      !submitting
    ) {
      handleSubmitInterview(true);
    }
  }, [timeLeft, stage]);

  /* =========================
     SPEECH RECOGNITION
  ========================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const rec = new SpeechRecognition();

    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      const currentQuestion = questions[currentIdx];

      if (!currentQuestion) return;

      const currentQId =
        currentQuestion.id || currentIdx + 1;

      setUserAnswers((prev) => ({
        ...prev,
        [currentQId]:
          (prev[currentQId]
            ? prev[currentQId] + " "
            : "") + transcript,
      }));
    };

    rec.onerror = (error) => {
      console.warn("Speech recognition error:", error);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {
        // already stopped
      }
    };
  }, [questions, currentIdx]);

  /* =========================
     VOICE RECORDING
  ========================= */

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert(
        "Voice input is not supported in this browser. You can type your answers directly."
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Could not start voice recognition:", error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
    }

    setIsRecording(false);
  };

  /* =========================
     START INTERVIEW
  ========================= */

  const handleStartInterview = async () => {
    if (!targetRole.trim()) {
      alert("Please enter a target job role.");
      return;
    }

    setStage("generating");

    try {
      const generated = await generateInterviewQuestions({
        category: selectedType,
        role: targetRole.trim(),
        resumeText: resumeData?.rawText || "",
        questionCount: Number(questionCount),
      });

      if (!Array.isArray(generated) || generated.length === 0) {
        throw new Error("No interview questions were generated.");
      }

      const normalizedQuestions = generated.map((question, index) => ({
        ...question,
        id: question.id || index + 1,
      }));

      setQuestions(normalizedQuestions);
      setCurrentIdx(0);
      setUserAnswers({});
      setShowHint(false);

      setTimeLeft(Number(questionCount) * 180);

      setStage("interview");
    } catch (error) {
      console.error("Question generation error:", error);

      alert(
        "Failed to generate interview questions. Please try again."
      );

      setStage("setup");
    }
  };

  /* =========================
     ANSWER CHANGE
  ========================= */

  const handleAnswerChange = (text) => {
    const currentQuestion = questions[currentIdx];

    if (!currentQuestion) return;

    const currentQId = currentQuestion.id;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQId]: text,
    }));
  };

  /* =========================
     NEXT
  ========================= */

  const handleNext = () => {
    setShowHint(false);
    stopRecording();

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  /* =========================
     PREVIOUS
  ========================= */

  const handlePrev = () => {
    setShowHint(false);
    stopRecording();

    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  /* =========================
     SUBMIT INTERVIEW
  ========================= */

  const handleSubmitInterview = async (automaticSubmit = false) => {
    if (submitting) return;

    stopRecording();

    const normalizedQnaList = questions.map((question, index) => {
      const questionId = question.id || index + 1;

      return {
        id: questionId,
        question: question.question || "",
        hints: question.hints || [],
        userAnswer: userAnswers[questionId] || "",
      };
    });

    const answeredCount = normalizedQnaList.filter(
      (item) =>
        typeof item.userAnswer === "string" &&
        item.userAnswer.trim().length > 0
    ).length;

    if (!automaticSubmit && answeredCount === 0) {
      alert(
        "Please answer at least one question before submitting."
      );
      return;
    }

    setSubmitting(true);
    setStage("evaluating");

    try {
      /* =========================
         AI EVALUATION
      ========================= */

      const evalResult = await evaluateInterviewSession({
        category: selectedType,
        role: targetRole,
        qnaList: normalizedQnaList,
      });

      /* =========================
         FINAL RESULT
      ========================= */

      const overallScore =
        Number(evalResult?.overallScore) || 0;

      const finalResult = {
        id: `session-${Date.now()}`,

        category: selectedType,

        role: targetRole,

        questionsCount: questions.length,

        overallScore,

        technicalScore:
          Number(evalResult?.technicalScore) || overallScore,

        communicationScore:
          Number(evalResult?.communicationScore) || overallScore,

        problemSolvingScore:
          Number(evalResult?.problemSolvingScore) || overallScore,

        verdict:
          evalResult?.verdict ||
          (overallScore >= 80
            ? "Hire"
            : overallScore >= 65
            ? "Strong Consider"
            : "Needs Practice"),

        summary:
          evalResult?.summary ||
          "Your interview has been evaluated successfully.",

        feedback:
          evalResult?.feedback ||
          evalResult?.summary ||
          "",

        strengths:
          Array.isArray(evalResult?.strengths)
            ? evalResult.strengths
            : [],

        weaknesses:
          Array.isArray(evalResult?.weaknesses)
            ? evalResult.weaknesses
            : [],

        improvements:
          Array.isArray(evalResult?.improvements)
            ? evalResult.improvements
            : [],

        recommendations:
          Array.isArray(evalResult?.recommendations)
            ? evalResult.recommendations
            : [],

        questionFeedback:
          Array.isArray(evalResult?.questionFeedback)
            ? evalResult.questionFeedback
            : [],

        qnaList: normalizedQnaList,

        completedAutomatically: automaticSubmit,

        createdAt: new Date().toISOString(),
      };

      console.log("FINAL INTERVIEW RESULT:", finalResult);

      /* =========================
         NO DATABASE FOR NOW
         
         Directly send result to Dashboard
      ========================= */

      if (onCompleteSession) {
        onCompleteSession(finalResult);
      } else {
        setStage("setup");

        alert(
          `Interview completed! Your score is ${overallScore}%.`
        );
      }
    } catch (error) {
      console.error("Interview evaluation error:", error);

      alert(
        "We could not evaluate this interview. Please try again."
      );

      setStage("setup");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     EXIT
  ========================= */

  const handleExitInterview = () => {
    stopRecording();

    const confirmed = window.confirm(
      "Are you sure you want to exit? Your current interview progress will be lost."
    );

    if (!confirmed) return;

    setQuestions([]);
    setUserAnswers({});
    setCurrentIdx(0);
    setShowHint(false);
    setTimeLeft(900);
    setStage("setup");
  };

  /* =========================
     TIMER FORMAT
  ========================= */

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /* =========================
     GENERATING
  ========================= */

  if (stage === "generating") {
    return (
      <div
        className="interview-screen"
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          🤖
        </div>

        <h2
          style={{
            fontSize: "24px",
            color: "#0f172a",
            marginBottom: "10px",
          }}
        >
          Generating Personalized Questions...
        </h2>

        <p
          style={{
            color: "#64748b",
            maxWidth: "500px",
            margin: "0 auto 30px",
          }}
        >
          Gemini AI is creating{" "}
          {selectedType.toLowerCase()} questions for your{" "}
          <strong>{targetRole}</strong> role.
        </p>

        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #dbeafe",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  /* =========================
     EVALUATING
  ========================= */

  if (stage === "evaluating") {
    return (
      <div
        className="interview-screen"
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          ⚡
        </div>

        <h2
          style={{
            fontSize: "24px",
            color: "#0f172a",
            marginBottom: "10px",
          }}
        >
          Evaluating Your Responses...
        </h2>

        <p
          style={{
            color: "#64748b",
            maxWidth: "500px",
            margin: "0 auto 30px",
          }}
        >
          AI is analyzing your answers, technical knowledge,
          communication and problem-solving ability.
        </p>

        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #dbeafe",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  /* =========================
     LIVE INTERVIEW
  ========================= */

  if (stage === "interview") {
    const currentQ = questions[currentIdx] || {
      question: "Loading...",
    };

    const currentQId = currentQ.id || currentIdx + 1;

    const currentAnswer = userAnswers[currentQId] || "";

    return (
      <div className="interview-screen">

        <div className="interview-screen-header">
          <div>
            <span>LIVE AI MOCK INTERVIEW</span>

            <h1>{selectedType}</h1>

            <p>
              Target Role: <strong>{targetRole}</strong>
            </p>
          </div>

          <div
            className="interview-timer"
            style={{
              color:
                timeLeft < 180 ? "#dc2626" : "#2563eb",
              borderColor:
                timeLeft < 180 ? "#fca5a5" : "#dbeafe",
            }}
          >
            ⏱️ {formatTimer(timeLeft)}
          </div>
        </div>

        {timeLeft === 0 && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px 14px",
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            ⏰ Time is up. Your interview is being submitted
            automatically.
          </div>
        )}

        <div className="question-card">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="question-number">
              QUESTION {currentIdx + 1} OF {questions.length}
            </span>

            {currentQ.difficulty && (
              <span
                style={{
                  fontSize: "11px",
                  background: "#f1f5f9",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                {currentQ.difficulty}
              </span>
            )}
          </div>

          <h2>{currentQ.question}</h2>

          {currentQ.hints &&
            currentQ.hints.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  💡{" "}
                  {showHint
                    ? "Hide Hint"
                    : "Show Answer Hint"}
                </button>

                {showHint && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "12px",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#166534",
                    }}
                  >
                    {currentQ.hints.join(" ")}
                  </div>
                )}
              </div>
            )}

          <textarea
            placeholder="Type or speak your answer here..."
            value={currentAnswer}
            onChange={(event) =>
              handleAnswerChange(event.target.value)
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={toggleVoiceRecording}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "6px",
                border: isRecording
                  ? "1px solid #ef4444"
                  : "1px solid #cbd5e1",
                background: isRecording
                  ? "#fef2f2"
                  : "#ffffff",
                color: isRecording
                  ? "#dc2626"
                  : "#475569",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {isRecording
                ? "🎙️ Recording... Click to stop"
                : "🎤 Speak Answer"}
            </button>

            <span
              style={{
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              {
                currentAnswer
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length
              }{" "}
              words
            </span>
          </div>

          <div className="question-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={handleExitInterview}
              style={{
                color: "#dc2626",
                borderColor: "#fca5a5",
              }}
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
                onClick={() => handleSubmitInterview(false)}
                disabled={submitting}
                style={{
                  background: "#16a34a",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit & Finish Interview ✓"}
              </button>
            )}

          </div>
        </div>
      </div>
    );
  }

  /* =========================
     SETUP
  ========================= */

  return (
    <section className="interview-panel">

      <div className="interview-panel-header">
        <span>AI MOCK INTERVIEW GENERATOR</span>

        <h1>Start an AI Mock Interview</h1>

        <p>
          Select an interview category, specify your target role,
          and practice with AI-generated questions.
        </p>
      </div>

      {resumeData && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#166534",
            }}
          >
            <strong>Resume Connected:</strong>{" "}
            AI will tailor questions matching your profile as{" "}
            <strong>{resumeData.jobTitle}</strong>.
          </div>

          <span
            style={{
              fontSize: "12px",
              background: "#dcfce7",
              color: "#15803d",
              padding: "2px 8px",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            {resumeData.skills?.length || 0} Skills Loaded
          </span>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "700",
              color: "#334155",
              marginBottom: "6px",
            }}
          >
            Target Job Role
          </label>

          <input
            type="text"
            value={targetRole}
            onChange={(event) =>
              setTargetRole(event.target.value)
            }
            placeholder="e.g. Frontend Engineer, Data Scientist"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "700",
              color: "#334155",
              marginBottom: "6px",
            }}
          >
            Number of Questions
          </label>

          <select
            value={questionCount}
            onChange={(event) =>
              setQuestionCount(Number(event.target.value))
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value={3}>
              3 Questions (Quick Practice)
            </option>

            <option value={5}>
              5 Questions (Standard Session)
            </option>

            <option value={10}>
              10 Questions (Comprehensive Assessment)
            </option>
          </select>
        </div>
      </div>

      <div className="interview-type-grid">
        {interviewTypes.map((type) => (
          <button
            type="button"
            key={type.name}
            className={`interview-type-card ${
              selectedType === type.name ? "selected" : ""
            }`}
            onClick={() => setSelectedType(type.name)}
          >
            <div className="interview-type-icon">
              {type.icon}
            </div>

            <h3>{type.name}</h3>

            <p>{type.description}</p>
          </button>
        ))}
      </div>

      <div className="interview-start-area">

        <div>
          <p>
            Selected Mode:{" "}
            <strong>{selectedType}</strong>
          </p>

          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            Role: {targetRole} · {questionCount} Questions
          </p>
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