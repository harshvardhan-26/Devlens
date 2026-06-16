import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { getProjectAnalysis, listProjectAnalyses } from "../services/projectStore.service.js";
import { httpError } from "../utils/httpError.js";
import { getProjectsByUser } from "../services/projectStore.service.js";
// import { getProjectsByUser } from "../services/projectStore.service.js";

const router = Router();

router.get("/projects", optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.uid || "demo-user";

    const projects = await getProjectsByUser(userId);

    res.set("Cache-Control", "no-store"); // 🔥 FIX

    res.json({ projects });

  } catch (error) {
    console.error("❌ PROJECT FETCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/project/:id", optionalAuth, async (req, res, next) => {
  try {
    const project = await getProjectAnalysis(req.params.id, req.user.uid);

    if (!project) {
      throw httpError(404, "Project analysis not found.");
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

export default router;
