/**
 * Prompt Templates for Gemini AI API
 */

export const RESUME_EXTRACTION_PROMPT = (resumeText) => `
You are an expert HR Specialist and AI Technical Recruiter.
Analyze the following resume text and extract candidate information into a clean JSON structure.

Resume Text:
"""
${resumeText}
"""

Return strictly valid JSON with this schema:
{
  "name": "Candidate Name (or Unknown if not specified)",
  "jobTitle": "Target or current job title (e.g. Full Stack Developer)",
  "experienceLevel": "Entry Level | Mid Level | Senior Level",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "summary": "2-3 sentence executive summary of the resume",
  "recommendedRoles": ["Role 1", "Role 2", "Role 3"]
}
`;

export const INTERVIEW_QUESTIONS_PROMPT = ({
  category = "Technical Interview",
  role = "Software Developer",
  resumeContext = "",
  questionCount = 5,
}) => `
You are an expert interviewer conducting a ${category} for a ${role} position.
${resumeContext ? `Candidate Resume Context:\n"""${resumeContext}"""` : ""}

Generate ${questionCount} tailored, realistic, high-quality interview questions.

Return strictly valid JSON array of objects with this schema:
[
  {
    "id": 1,
    "question": "Question text here...",
    "category": "${category}",
    "type": "${category}",
    "difficulty": "Easy | Medium | Hard",
    "hints": ["Hint 1 to help candidate shape their answer"],
    "expectedTopics": ["Key concept 1", "Key concept 2"]
  }
]
`;

export const ANSWER_EVALUATION_PROMPT = ({
  category = "Technical Interview",
  role = "Software Developer",
  qnaList = [],
}) => `
You are an expert Interview Evaluator and Career Coach.
Evaluate the candidate's answers in a ${category} for a ${role} position.

Candidate Q&A Responses:
${JSON.stringify(qnaList, null, 2)}

Provide a detailed evaluation with objective scores (0-100) and actionable feedback.

Return strictly valid JSON object matching this schema:
{
  "overallScore": 85,
  "technicalScore": 88,
  "communicationScore": 82,
  "problemSolvingScore": 84,
  "verdict": "Hire | Strong Consider | Needs Practice",
  "summary": "Comprehensive 3-4 sentence performance overview.",
  "strengths": [
    "Clear explanation of core concepts",
    "Good practical examples provided"
  ],
  "improvements": [
    "Could detail edge cases more thoroughly",
    "Structured STAR method approach recommended for behavioral questions"
  ],
  "questionFeedback": [
    {
      "questionId": 1,
      "question": "Original question text...",
      "userAnswer": "Candidate's response...",
      "score": 85,
      "feedback": "Specific feedback on candidate's answer...",
      "idealAnswer": "Concise high-scoring sample answer..."
    }
  ]
}
`;
