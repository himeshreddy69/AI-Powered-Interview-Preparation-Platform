# AI-Powered Interview Preparation Platform

## Overview

The AI-Powered Interview Preparation Platform is a web application designed to help students and job seekers prepare for interviews more effectively. Users can upload their resumes, receive AI-generated interview questions based on their skills, practice mock interviews, and track their performance over time.

The main objective of this project is to make interview preparation more personalized using Artificial Intelligence.

---

## Features

- User Authentication (email/password and Google sign-in)
- Resume Upload (PDF or TXT)
- AI Resume Analysis and skill extraction
- AI-Generated Interview Questions
- Technical, HR, Coding and Behavioral Interview Modes
- Company-specific practice tracks
- Mock Interview with a countdown timer that auto-submits when time runs out
- Voice Recording (browser Web Speech API)
- AI Feedback and Score Analysis
- Progress Dashboard with performance charts
- Interview History
- Dark Mode

> **Not implemented yet:** an Admin Panel. Earlier versions of this README
> listed one, but no admin functionality exists in the codebase.

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Context API
- CSS

### Authentication
- Firebase Authentication

### Database & Storage
- Supabase (Postgres + Storage)

### AI
- Google Gemini API (`gemini-2.5-flash`)

### Other Tools
- Recharts
- pdf.js (resume text extraction)
- Git & GitHub

### Why two backends?

Firebase handles **login only**. Everything the user creates — profiles,
resumes, interview results, uploaded files — lives in **Supabase**.

To keep that safe, the app passes the user's Firebase ID token to Supabase on
every request, so Supabase's row level security can verify who is asking. See
[SUPABASE_SETUP.md](SUPABASE_SETUP.md).

---

## Project Structure

```
AI-Powered-Interview-Preparation-Platform
│
├── public
├── supabase
│   └── schema.sql          # tables, security rules, storage buckets
├── src
│   ├── assets/styles
│   ├── components
│   │   ├── common          # landing page + shared UI
│   │   └── dashboard       # logged-in dashboard panels
│   ├── context             # AuthContext, ThemeContext
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   │   ├── ai              # Gemini client, prompts, scoring
│   │   ├── firebase        # auth only
│   │   └── supabase        # database + file storage
│   ├── utils
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── SUPABASE_SETUP.md
└── README.md
```

---

## How It Works

1. Create an account or log in.
2. Upload your resume.
3. AI analyzes your resume and extracts important skills.
4. Generate interview questions based on your resume and selected role.
5. Start a mock interview.
6. Submit your answers (by typing or by voice).
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

## Setup

### 1. Environment variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

| Variable | What it is for | Where to get it |
| --- | --- | --- |
| `VITE_FIREBASE_*` | Login | Firebase Console → Project settings → Your apps |
| `VITE_SUPABASE_URL` | Database + storage | Supabase → Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Database + storage | Supabase → Project Settings → API |
| `VITE_GEMINI_API_KEY` | AI questions and scoring | [Google AI Studio](https://aistudio.google.com/apikey) |

Vite only reads `.env` at startup, so **restart the dev server** after changing it.

### 2. Supabase

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor,
then follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to connect Firebase logins to
Supabase. Without that last step the app falls back to storing data in the
browser only.

### 3. Gemini

If `VITE_GEMINI_API_KEY` is missing, the app still runs, but questions and
feedback come from a built-in sample set instead of real AI. A yellow warning
banner appears in the app whenever this is the case, so it is never mistaken for
genuine AI output.

---

## Future Improvements

- Video Interview Support
- ATS Resume Checker
- Coding Interview Module with a code editor
- Multi-language Support
- AI Career Guidance
- Admin Panel

---

## Author

**Himesh Reddy**

B.Tech CSE

IIIT Kottayam

GitHub: https://github.com/himeshreddy69

---

## License

This project is created for learning and educational purposes.
