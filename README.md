# AI-Powered Interview Preparation Platform

## Overview

The AI-Powered Interview Preparation Platform is a web application designed to help students and job seekers prepare for interviews more effectively. Users can upload their resumes, receive AI-generated interview questions based on their skills, practice mock interviews, and track their performance over time.

The main objective of this project is to make interview preparation more personalized using Artificial Intelligence.

---

## Features

- User Authentication
- Resume Upload
- AI Resume Analysis
- AI-Generated Interview Questions
- Technical, HR and Behavioral Interview Modes
- Mock Interview with Timer
- Voice Recording
- AI Feedback and Score Analysis
- Progress Dashboard
- Interview History
- Admin Panel

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Context API
- CSS

### Backend
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

### AI
- Google Gemini API

### Other Tools
- Recharts
- Git
- GitHub

---

## Project Structure

```
AI-Powered-Interview-Preparation-Platform
│
├── public
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   ├── routes
│   ├── services
│   ├── utils
│   ├── data
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── firebase.json
└── README.md
```

---

## How It Works

1. Create an account or log in.
2. Upload your resume.
3. AI analyzes your resume and extracts important skills.
4. Generate interview questions based on your resume and selected role.
5. Start a mock interview.
6. Submit your answers.
7. Receive AI-generated feedback and scores.
8. Track your progress on the dashboard.

---

## Installation

Clone the repository

```bash
git clone https://github.com/himeshreddy69/AI-Powered-Interview-Preparation-Platform.git
```

Go to the project directory

```bash
cd AI-Powered-Interview-Preparation-Platform
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file and add your Firebase and Gemini API keys.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_GEMINI_API_KEY=
```

---

## Future Improvements

- Video Interview Support
- ATS Resume Checker
- Company-specific Interview Sets
- Coding Interview Module
- Multi-language Support
- Dark Mode
- AI Career Guidance

---

## Author

**Himesh Reddy**

B.Tech CSE

IIIT Kottayam

GitHub: https://github.com/himeshreddy69

---

## License

This project is created for learning and educational purposes.