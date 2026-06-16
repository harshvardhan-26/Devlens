import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from "openai";
import Groq from "groq-sdk";


// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
dotenv.config({ quiet: true });

/* ------------------ STRICT FORMAT ------------------ */
const STRICT_SCHEMA_NOTE = `Return ONLY valid JSON in this format:
{
  "score": 78,
  "jobReadiness": "Intermediate",
  "codeQuality": "...",
  "architecture": "...",
  "uiFeedback": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvements": ["..."],
  "nextSteps": ["..."]
}`;

/* ------------------ SCHEMA ------------------ */
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    jobReadiness: { type: Type.STRING },
    codeQuality: { type: Type.STRING },
    architecture: { type: Type.STRING },
    uiFeedback: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "score",
    "jobReadiness",
    "codeQuality",
    "architecture",
    "uiFeedback",
    "strengths",
    "weaknesses",
    "improvements",
    "nextSteps"
  ]
};

/* ------------------ BUILD CONTEXT ------------------ */
function buildProjectContext(project) {
  return project.files
    .map(
      (file) => `File: ${file.path}
Language: ${file.language}

${file.content.slice(0, 5000)}`
    )
    .join("\n\n---\n\n");
}

/* ------------------ PROMPT ------------------ */
function buildPrompt(project) {
return `
You are an experienced engineering manager reviewing a developer's project portfolio.

Your goal is to provide feedback that helps the developer improve their project quality, maintainability, and hiring readiness.

Analyze the project and return concise, actionable feedback.

IMPORTANT RULES:

* Be specific to the actual codebase.
* Mention real findings from the project.
* Avoid generic advice.
* No file paths.
* No code snippets.
* No markdown formatting.
* No long explanations.
* Write feedback for the repository owner, not framework maintainers.
* Prioritize maintainability, scalability, testing, security, developer experience, and production readiness.
* Ignore minor implementation details unless they significantly impact quality.

For strengths, weaknesses, improvements, and nextSteps:

* Maximum 7 items each.
* Each item must be under 15 words.
* Use simple language.
* Use recruiter-friendly wording.
* Focus on practical project-level observations.

GOOD:

"Project structure is easy to maintain"
"Authentication flow is well organized"
"Good separation of frontend and backend"
"Add automated testing"

BAD:

"Flexible middleware pipeline"
"Strong support for sub-applications"
"The use of ReactDOM.render..."
"Dependency injection is missing"

The response should feel like feedback from a senior engineering manager at a modern software company.

${STRICT_SCHEMA_NOTE}

Project:

${buildProjectContext(project)}

`;
}


/* ------------------ SAFE JSON PARSER ------------------ */
function safeParseJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
  } catch {
    return null;
  }
}

/* ------------------ NORMALIZER ------------------ */
function normalizeFeedback(feedback) {
  const score = Math.max(0, Math.min(100, Number(feedback?.score) || 0));

  return {
    score,
    jobReadiness: feedback?.jobReadiness || "Unknown",
    codeQuality: feedback?.codeQuality || "No data",
    architecture: feedback?.architecture || "No data",
    uiFeedback: feedback?.uiFeedback || "No data",
    strengths: Array.isArray(feedback?.strengths) ? feedback.strengths : [],
    weaknesses: Array.isArray(feedback?.weaknesses) ? feedback.weaknesses : [],
    improvements: Array.isArray(feedback?.improvements) ? feedback.improvements : [],
    nextSteps: Array.isArray(feedback?.nextSteps) ? feedback.nextSteps : []
  };
}


/* ------------------ GEMINI ------------------ */
async function analyzeWithGemini(project, retries = 3) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  

  try {
    
    // console.time("MAIN_GEMINI");

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: buildPrompt(project),
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2
      }
    });
    // console.timeEnd("MAIN_GEMINI");

    const raw = response.text || "";
    

    const parsed = safeParseJSON(raw);

    if (!parsed) throw new Error("Invalid JSON from Gemini");

    return normalizeFeedback(parsed);

  }
   catch (err) {
    

    // 🔥 RETRY for temporary errors
    if ((err.status === 503 || err.status === 429) && retries > 0) {
      

      await new Promise(res => setTimeout(res, 3000)); // wait 3 sec

      return analyzeWithGemini(project, retries - 1);
    }

    // ❌ FINAL FAIL
    throw err;
  }
}

async function analyzeWithGroq(project) {
  const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

  

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: buildPrompt(project)
        }
      ],
      temperature: 0.2
    });

  const raw =
    completion.choices[0].message.content;

  

  const parsed = safeParseJSON(raw);

  if (!parsed)
    throw new Error(
      "Invalid JSON from Groq"
    );

  return normalizeFeedback(parsed);
}

/* ------------------ OPENAI ------------------ */
async function analyzeWithOpenAI(project) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a strict software reviewer." },
      { role: "user", content: buildPrompt(project) }
    ],
    temperature: 0.2
  });

  const parsed = safeParseJSON(
    completion.choices[0]?.message?.content || ""
  );

  if (!parsed) throw new Error("Invalid JSON from OpenAI");

  return normalizeFeedback(parsed);
}

/* ------------------ FALLBACK ------------------ */
function heuristicAnalysis(project) {
  const hasHTML = project.files.some(f => f.path.endsWith(".html"));
  const hasCSS = project.files.some(f => f.path.endsWith(".css"));
  const hasJS = project.files.some(f => f.path.endsWith(".js"));

  return {
    score: hasJS ? 65 : 55,
    jobReadiness: hasJS ? "Junior-ready" : "Beginner",

    codeQuality: hasJS
      ? "Project includes JavaScript logic, but lacks complexity and modular structure."
      : "Static frontend detected with limited interactivity.",

    architecture: hasJS
      ? "Basic separation of HTML, CSS, and JS exists but lacks scalable architecture."
      : "No clear architectural separation beyond static files.",

    uiFeedback: hasCSS
      ? "UI styling exists but could be improved with responsiveness and better layout structure."
      : "Minimal styling detected.",

    strengths: [
      hasHTML && "Uses HTML structure correctly",
      hasCSS && "Includes CSS styling",
      hasJS && "Contains JavaScript logic"
    ].filter(Boolean),

    weaknesses: [
      !hasJS && "No interactivity (missing JS)",
      "No component-based architecture",
      "Limited scalability"
    ],

    improvements: [
      "Add modular JavaScript structure",
      "Improve responsiveness",
      "Introduce reusable components"
    ],

    nextSteps: [
      "Convert into React or modern framework",
      "Add real-world features"
    ]
  };
}

/* ------------------ MAIN ------------------ */
export async function analyzeProject(project) {
  
  
  

  try {
    if (process.env.GEMINI_API_KEY) {
      try {
        const ignored = [
            "node_modules",
            "dist",
            "build",
            ".next",
            "coverage",
            ".git"
          ];

          const ignoredFiles = [
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            "bun.lockb"
          ];

          project.files = project.files.filter(
            file =>
              !ignored.some(name =>
                file.path.includes(name)
              ) &&
              !ignoredFiles.includes(
                file.path.split("/").pop()
              )
          )
          .slice(0,30);
          


        return await analyzeWithGemini(project);
      } catch (err) {
        
      }
    }

    if (process.env.GROQ_API_KEY) {
      try {
        

        return await analyzeWithGroq(project);
      } catch (err) {
        
      }
    }

    

    return heuristicAnalysis(project);

  } catch (err) {
    console.error(
      "❌ AI FAILED COMPLETELY:",
      err
    );

    return heuristicAnalysis(project);
  }
}

export async function checkAiStatus() {
  try {
    if (process.env.GEMINI_API_KEY) {
      return {
        ok: true,
        provider: "gemini",
        configured: true,
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        message: "Gemini API is configured."
      };
    }

    if (process.env.OPENAI_API_KEY) {
      return {
        ok: true,
        provider: "openai",
        configured: true,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        message: "OpenAI API is configured."
      };
    }

    return {
      ok: false,
      provider: null,
      configured: false,
      model: null,
      message: "No AI API key found."
    };

  } catch (error) {
    return {
      ok: false,
      provider: null,
      configured: false,
      model: null,
      message: error.message
    };
  }
}

async function generateWithGroq(prompt) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

  return completion.choices[0].message.content.trim();
}

