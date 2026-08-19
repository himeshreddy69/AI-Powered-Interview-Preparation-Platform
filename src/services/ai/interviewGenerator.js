import { generateJSONResponse } from "./gemini";
import { INTERVIEW_QUESTIONS_PROMPT } from "./promptTemplates";

/**
 * Fallback questions when API key is missing or API call fails
 */
function getFallbackQuestions(category = "Technical Interview", role = "Software Engineer", count = 5) {
  const defaultBank = {
    "HR Interview": [
      {
        id: 1,
        question: "Tell me about yourself and why you are interested in this position.",
        category: "HR Interview",
        difficulty: "Easy",
        hints: ["Focus on relevant skills, past achievements, and why this role fits your career goals."],
        expectedTopics: ["Background", "Motivation", "Career Alignment"]
      },
      {
        id: 2,
        question: "What are your greatest professional strengths and one area you are actively working to improve?",
        category: "HR Interview",
        difficulty: "Medium",
        hints: ["Provide concrete examples for strengths and a constructive growth plan for your improvement area."],
        expectedTopics: ["Self Awareness", "Continuous Learning"]
      },
      {
        id: 3,
        question: "Describe a situation where you had a conflict with a teammate. How did you resolve it?",
        category: "HR Interview",
        difficulty: "Medium",
        hints: ["Use the STAR method (Situation, Task, Action, Result) focusing on constructive collaboration."],
        expectedTopics: ["Conflict Resolution", "Teamwork", "Communication"]
      },
      {
        id: 4,
        question: "Where do you see yourself professionally in the next 3 to 5 years?",
        category: "HR Interview",
        difficulty: "Easy",
        hints: ["Highlight skill growth, leadership ambition, and long-term value creation."],
        expectedTopics: ["Career Vision", "Ambition"]
      },
      {
        id: 5,
        question: "Why should we hire you over other qualified candidates for this role?",
        category: "HR Interview",
        difficulty: "Hard",
        hints: ["Summarize your unique mix of technical capability, passion, and cultural fit."],
        expectedTopics: ["Value Proposition", "Confidence"]
      }
    ],
    "Technical Interview": [
      {
        id: 1,
        question: `Explain the architectural design principles you follow when building scalable ${role} applications.`,
        category: "Technical Interview",
        difficulty: "Medium",
        hints: ["Mention modularity, clean code principles, separation of concerns, and API design."],
        expectedTopics: ["Architecture", "Scalability", "Clean Code"]
      },
      {
        id: 2,
        question: "How do you manage async operations, error handling, and state synchronization in production environments?",
        category: "Technical Interview",
        difficulty: "Hard",
        hints: ["Discuss promises, async/await, try/catch patterns, and centralized state management."],
        expectedTopics: ["Asynchronous JS/Code", "Error Handling", "State Management"]
      },
      {
        id: 3,
        question: "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR), and when to use each.",
        category: "Technical Interview",
        difficulty: "Medium",
        hints: ["Compare SEO, initial load speed, server workload, and user experience."],
        expectedTopics: ["Rendering Strategies", "Performance", "Web Architecture"]
      },
      {
        id: 4,
        question: "How do you optimize application performance and reduce memory leaks in high-traffic web applications?",
        category: "Technical Interview",
        difficulty: "Hard",
        hints: ["Talk about code splitting, lazy loading, debouncing, memoization, and profiler tools."],
        expectedTopics: ["Performance Optimization", "Memory Management"]
      },
      {
        id: 5,
        question: "Describe your approach to writing automated unit and integration tests for core business logic.",
        category: "Technical Interview",
        difficulty: "Medium",
        hints: ["Discuss TDD concepts, mocking external dependencies, and coverage strategies."],
        expectedTopics: ["Testing", "Jest/Vitest", "Code Quality"]
      }
    ],
    "Coding Interview": [
      {
        id: 1,
        question: "Given an array of integers `nums` and a target integer `target`, return indices of the two numbers such that they add up to target. Explain your algorithm's time and space complexity.",
        category: "Coding Interview",
        difficulty: "Easy",
        hints: ["Can you solve it in O(n) time using a hash map/dictionary?"],
        expectedTopics: ["Hash Map", "Arrays", "Time/Space Complexity"]
      },
      {
        id: 2,
        question: "Write a function to determine if a string containing brackets `()[]{}` is valid. Brackets must close in the correct order.",
        category: "Coding Interview",
        difficulty: "Medium",
        hints: ["Think about using a Stack data structure."],
        expectedTopics: ["Stack Data Structure", "Strings", "Validation"]
      },
      {
        id: 3,
        question: "Implement a function to find the maximum depth of a binary tree.",
        category: "Coding Interview",
        difficulty: "Medium",
        hints: ["Use recursion (DFS) or iteration (BFS with Queue)."],
        expectedTopics: ["Trees", "Recursion", "DFS/BFS"]
      },
      {
        id: 4,
        question: "Given an array of intervals, merge all overlapping intervals and return an array of non-overlapping intervals.",
        category: "Coding Interview",
        difficulty: "Hard",
        hints: ["Sort intervals by start time first before merging in a single pass."],
        expectedTopics: ["Sorting", "Intervals", "Greedy Algorithm"]
      },
      {
        id: 5,
        question: "Implement a Least Recently Used (LRU) Cache data structure supporting `get` and `put` in O(1) time complexity.",
        category: "Coding Interview",
        difficulty: "Hard",
        hints: ["Combine a HashMap for O(1) lookups with a Doubly Linked List for O(1) ordering updates."],
        expectedTopics: ["LRU Cache", "Doubly Linked List", "System Design"]
      }
    ],
    "Behavioral Interview": [
      {
        id: 1,
        question: "Describe a time when you worked under a tight deadline and had to deliver a critical milestone. How did you prioritize tasks?",
        category: "Behavioral Interview",
        difficulty: "Medium",
        hints: ["Explain trade-offs, scope management, and transparent team communication."],
        expectedTopics: ["Time Management", "Pressure", "Prioritization"]
      },
      {
        id: 2,
        question: "Tell me about a project that failed or didn't meet expectations. What went wrong and what did you learn?",
        category: "Behavioral Interview",
        difficulty: "Medium",
        hints: ["Be honest, take accountability, and focus heavily on key learnings and post-mortem improvements."],
        expectedTopics: ["Accountability", "Resilience", "Continuous Growth"]
      },
      {
        id: 3,
        question: "How do you handle receiving critical feedback on your code or design work during peer reviews?",
        category: "Behavioral Interview",
        difficulty: "Easy",
        hints: ["Emphasize humility, seeking clarity, and valuing team standards over ego."],
        expectedTopics: ["Receiving Feedback", "Collaboration"]
      },
      {
        id: 4,
        question: "Describe a scenario where you had to lead a project initiative without explicit authority.",
        category: "Behavioral Interview",
        difficulty: "Hard",
        hints: ["Show influence, building consensus, and taking proactive initiative."],
        expectedTopics: ["Leadership", "Initiative", "Influence"]
      },
      {
        id: 5,
        question: "How do you stay updated with emerging technologies and decide when to adopt a new library or tool?",
        category: "Behavioral Interview",
        difficulty: "Easy",
        hints: ["Discuss blogs, open-source projects, POCs, and evaluating tech maturity vs complexity."],
        expectedTopics: ["Learning Mindset", "Tech Evaluation"]
      }
    ]
  };

  const selectedCategoryBank = defaultBank[category] || defaultBank["Technical Interview"];
  return selectedCategoryBank.slice(0, count);
}

/**
 * Generate Interview Questions using Gemini or Fallback
 */
export async function generateInterviewQuestions({
  category = "Technical Interview",
  role = "Software Developer",
  resumeText = "",
  questionCount = 5,
  company = null
}) {
  const prompt = INTERVIEW_QUESTIONS_PROMPT({
    category,
    role,
    resumeContext: resumeText,
    questionCount,
    company
  });

  const fallback = getFallbackQuestions(category, role, questionCount);

  try {
    const questions = await generateJSONResponse(prompt, fallback);
    if (Array.isArray(questions) && questions.length > 0) {
      return questions.map((q, idx) => ({
        ...q,
        id: q.id || idx + 1,
        category: category,
      }));
    }
    return fallback;
  } catch (error) {
    console.warn("Using fallback interview questions due to API response error:", error);
    return fallback;
  }
}
