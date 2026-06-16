import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import analysisRoutes from "./routes/analysis.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 40,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Project Insight AI" });
});

app.get("/api/test-ai", (req, res) => {
  res.json({
    ok: true,
    provider: "gemini",
    message: "Gemini API is responding."
  });
});

app.use("/api", analysisRoutes);
app.use("/api", projectRoutes);
app.use(errorHandler);

export default app;
