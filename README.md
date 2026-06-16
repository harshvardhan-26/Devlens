# Devlens

Devlens is an AI-powered code review platform that evaluates software projects the way a senior engineer or hiring manager would.

Instead of only checking syntax or linting issues, Devlens analyzes project structure, architecture, maintainability, UI quality, and overall job readiness. Users can submit a public GitHub repository or upload project files directly and receive detailed feedback, strengths, weaknesses, improvement recommendations, and a project score.

### Why I Built It

Most developers receive feedback only after submitting applications or during technical interviews.

I wanted a tool that could provide actionable project reviews earlier in the process. Devlens was built to simulate the kind of feedback a candidate might receive from an experienced reviewer, helping developers identify weaknesses before showcasing their work publicly.

---

## Live Application

Frontend: https://devlens-nu.vercel.app

Backend API: https://devlens-api-1009.onrender.com

---

## What Devlens Evaluates

* Code quality and maintainability
* Project architecture and organization
* UI and user experience quality
* Job readiness level
* Technical strengths
* Areas for improvement
* Recommended next learning steps

---

## Core Workflows

### Analyze a GitHub Repository

Paste a public GitHub repository URL and receive:

* Project classification
* AI-generated review
* Code quality assessment
* Architecture feedback
* Actionable recommendations

![GitHub Analysis](README-assets/github-analysis.png)

---

### Analyze Uploaded Projects

Upload source files directly for review without publishing code publicly.

Ideal for:

* Academic projects
* Personal projects
* Work-in-progress applications
* Portfolio reviews

![Upload Analysis](README-assets/upload-analysis.png)

---

### Track Growth Over Time

Devlens stores previous analyses and provides:

* Projects analyzed
* Average score
* Best score
* Skill insights extracted from prior reviews

![Profile](README-assets/profile.png)

---

## Technical Architecture

Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion

Backend

* Node.js
* Express
* MongoDB Atlas
* JWT Authentication

AI Layer

* Google Gemini
* Groq

Deployment

* Vercel
* Render

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/harshvardhan-26/Devlens.git
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
cd server
npm run dev
```

Run frontend:

```bash
cd client
npm run dev
```

---

## Author

Harshvardhan

GitHub:
https://github.com/harshvardhan-26
