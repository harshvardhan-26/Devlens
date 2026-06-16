import crypto from "node:crypto";
import mongoose from "mongoose";
import { ProjectAnalysis } from "../models/ProjectAnalysis.js";

const memoryStore = [];
const summaryStore = new Map();

export function saveUserSummary(userId, summary) {
  summaryStore.set(userId, summary);
}

export function getUserSummary(userId) {
  return summaryStore.get(userId);
}

export async function getProjectsByUser(userId) {
  return await ProjectAnalysis.find({ userId }).sort({ createdAt: -1 });
}

function hasMongoConnection() {
  return mongoose.connection.readyState === 1;
}

function serializeRecord(record) {
  const object = record.toObject ? record.toObject() : record;
  return {
    ...object,
    _id: String(object._id)
  };
}

export async function createProjectAnalysis(payload) {
  if (hasMongoConnection()) {
    const record = await ProjectAnalysis.create(payload);
    return serializeRecord(record);
  }

  const now = new Date().toISOString();
  const record = {
    _id: crypto.randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now
  };
  memoryStore.unshift(record);
  return record;
}

// export async function getProjectsByUser(userId) {
//   try {
//     if (hasMongoConnection()) {
//       const projects = await ProjectAnalysis.find({ userId })
//         .sort({ createdAt: -1 })
//         .lean();

//       return projects;
//     }

//     return memoryStore.filter(p => p.userId === userId);

//   } catch (err) {
//     console.error("❌ ERROR IN getProjectsByUser:", err);
//     throw err;
//   }
// }

export async function getProjectById(id) {
  if (hasMongoConnection()) {
    const record = await ProjectAnalysis.findById(id);
    return record;
  }

  return memoryStore.find((item) => item._id === id);
}

export async function listProjectAnalyses(userId) {
  if (hasMongoConnection()) {
    const projects = await ProjectAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("projectName githubUrl score jobReadiness projectType sourceType createdAt");
    return projects.map(serializeRecord);
  }

  return memoryStore
    .filter((project) => project.userId === userId)
    .slice(0, 50)
    .map(({ feedback, analyzedFiles, ...summary }) => summary);
}

export async function getProjectAnalysis(id, userId) {
  if (hasMongoConnection()) {
    const project = await ProjectAnalysis.findOne({ _id: id, userId });
    return project ? serializeRecord(project) : null;
  }

  return memoryStore.find((project) => project._id === id && project.userId === userId) || null;
}
export async function getProjectByGithubUrl(githubUrl) {
  if (hasMongoConnection()) {
    return await ProjectAnalysis.findOne({ githubUrl }).lean();
  }

  return memoryStore.find(p => p.githubUrl === githubUrl);
}