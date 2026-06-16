import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { optionalAuth } from "../middleware/auth.js";
import { analyzeProject, checkAiStatus } from "../services/ai.service.js";
import { extractRepository, extractUploadedFiles } from "../services/github.service.js";
import { createProjectAnalysis } from "../services/projectStore.service.js";
import { httpError } from "../utils/httpError.js";
import { getProjectByGithubUrl } from "../services/projectStore.service.js";
import { getProjectById } from "../services/projectStore.service.js";
// import { getProjectsByUser } from "../services/projectStore.service.js";
import { getProjectsByUser } from "../services/projectStore.service.js";

import {
  saveUserSummary,
  getUserSummary
} from "../services/userSummary.service.js";
import { auth } from "../middleware/auth.js";
// import { getProjectsByUser } from "../services/projectStore.service.js";
import { ProjectAnalysis } from "../models/ProjectAnalysis.js";
import { UserSummary } from "../models/UserSummary.js";



const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 40,
    fileSize: 1_000_000
  }
});


// ✅ PROJECT TYPE DETECTION
function detectProjectType(files) {
  const paths = files.map(f => f.path.toLowerCase());

  const hasHTML = paths.some(p => p.endsWith(".html"));
  const hasCSS = paths.some(p => p.endsWith(".css"));
  const hasJS = paths.some(p => p.endsWith(".js"));
  const hasReact = paths.some(p => p.includes("react") || p.includes(".jsx") || p.includes(".tsx"));
  const hasNode = paths.some(p => p.includes("package.json"));
  const hasBackend = paths.some(p =>
    p.includes("server") || p.includes("api") || p.includes("routes") || p.includes("controllers")
  );
  const hasPython = paths.some(p => p.endsWith(".py"));

  if (hasHTML && hasCSS && !hasBackend && !hasReact) return "frontend-static";
  if (hasReact) return "frontend-react";
  if (hasNode && hasBackend) return "backend-node";
  if (hasPython) return "backend-python";
  if (hasNode && hasReact) return "fullstack";

  return "general";
}


// ✅ VALIDATION
const analyzeSchema = z.object({
  githubUrl: z.string().url()
});

router.get("/ai-status", optionalAuth, async (_req, res, next) => {
  try {
    res.json(await checkAiStatus());
  } catch (error) {
    next(error);
  }
});

// ✅ AI STATUS



// ✅ SAVE RESULT
async function persistAnalysis({ req, project, feedback, sourceType = "github" }) {
  
  const record = await createProjectAnalysis({
    
    // userId: req.user?.uid || "demo-user",
    projectName: project.projectName,
    githubUrl: project.githubUrl,
    sourceType,
    userId: req.user.email,
    projectType: project.projectType, // now correct
    score: feedback.score,
    jobReadiness: feedback.jobReadiness,
    feedback,
    analyzedFiles: project.files.map(({ path, language, bytes }) => ({
      path,
      language,
      bytes
    }))
  });
  // 🔥 GET USER PROJECTS
  const userProjects = await getProjectsByUser(req.user.email);
  

  

  return record;
}




// ✅ MAIN ROUTE (FIXED)
router.post("/analyze-project", auth, async (req, res) => {
  

  try {
    const parsed = analyzeSchema.safeParse(req.body);

    if (!parsed.success) {
      throw httpError(400, "Send a valid GitHub repository URL.", parsed.error.flatten());
    }

    

    // -------- STEP 1: CHECK CACHE FIRST 🔥 --------
    const existing = await ProjectAnalysis.findOne({
      githubUrl: parsed.data.githubUrl,
      userId: req.user.email
    });

    if (existing) {
      return res.status(200).json({
        project: existing,
        feedback: existing.feedback
      });
    }

    // -------- STEP 2: EXTRACT --------
    let project;
    try {
      console.time("REPO_EXTRACTION");
      project = await extractRepository(parsed.data.githubUrl);
      console.timeEnd("REPO_EXTRACTION");
      
    } catch (err) {
      console.error("❌ ERROR IN extractRepository:", err);
      throw err;
    }

    // -------- STEP 3: TYPE DETECTION --------
    const detectedType = detectProjectType(project.files);
    project.projectType = detectedType;

    project.fileSummary = project.files
      .map(f => `${f.path} (${f.language})`)
      .join("\n");

    

    // -------- STEP 4: AI --------
    let feedback;

    try {
      feedback = await analyzeProject(project);
    } catch (err) {
      
      feedback = heuristicAnalysis(project);

      return res.status(200).json({ project, feedback }); // ❌ DO NOT SAVE
    }

    // -------- STEP 5: SAVE --------
    let record;
    try {
      console.time("SAVE_PROJECT");
      record = await persistAnalysis({
        req,
        project,
        feedback,
        sourceType: "github"
      });
      console.time("SAVE_PROJECT");
      const projects =
          await getProjectsByUser(req.user.email);

        
        if (projects.length >= 3) {
            

            const summaryData = {
              projectsAnalyzed: projects.length,
              averageScore: Math.round(
                projects.reduce(
                  (sum, p) => sum + (p.feedback?.score || 0),
                  0
                ) / projects.length
              ),
              bestScore: Math.max(
                ...projects.map(p => p.feedback?.score || 0)
              ),
              level: "Intermediate",
              // mentorSummary: "Test summary",
              // nextMilestone: "Test milestone"
            };
            const userProjects =
              await getProjectsByUser(req.user.email);


            const saved = await saveUserSummary(
              req.user.email,
              summaryData
            );

            
          }
      
    } catch (err) {
      console.error("❌ ERROR IN persistAnalysis:", err);
      throw err;
    }

    res.status(201).json({ project: record, feedback });

  } catch (error) {
    console.error("🔥 FINAL ERROR:", error);

    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});


// ✅ FILE UPLOAD ROUTE (ALSO FIXED)
router.post("/analyze-upload", optionalAuth, upload.array("files"), async (req, res, next) => {
  try {
    const project = extractUploadedFiles(req.files || []);

    const detectedType = detectProjectType(project.files);
    

    project.projectType = detectedType;

    
    const feedback = await analyzeProject(project);

    
    const record = await persistAnalysis({
      req,
      project,
      feedback,
      sourceType: "upload"
    });

    

    res.status(201).json({ project: record, feedback });

  } catch (error) {
    console.error("UPLOAD ERROR:");
    console.error(error);
    console.error(error.stack); // 👈 add here

    next(error);
  }
});




router.get("/summary", auth, async (req, res) => {
  try {
    const summary = await UserSummary.findOne({
        userId: req.user.email
    });

      

    res.json({
  summary: summary?.summary || null
});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch summary"
    });
  }
});

router.get("/projects", auth, async (req, res) => {
  
  try {
    const projects = await getProjectsByUser(req.user.email);

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});


router.get("/project/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.email // 🔥 IMPORTANT
    });

    if (!project) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;