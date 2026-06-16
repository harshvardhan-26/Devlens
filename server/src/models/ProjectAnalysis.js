import mongoose from "mongoose";

const ProjectAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    githubUrl: { type: String },
    sourceType: { type: String, enum: ["github", "upload"], default: "github" },
    projectType: { type: String, default: "Full-stack" },
    score: { type: Number, required: true },
    jobReadiness: { type: String, required: true },
    feedback: {
      score: Number,
      jobReadiness: String,
      codeQuality: String,
      architecture: String,
      uiFeedback: String,
      strengths: [String],
      weaknesses: [String],
      improvements: [String],
      nextSteps: [String]
    },
    analyzedFiles: [
      {
        path: String,
        language: String,
        bytes: Number
      }
    ]
  },
  { timestamps: true }
);

export const ProjectAnalysis = mongoose.model("ProjectAnalysis", ProjectAnalysisSchema);
