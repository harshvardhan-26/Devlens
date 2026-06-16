import { UserSummary } from "../models/UserSummary.js";

export async function saveUserSummary(
  userId,
  summary
) {
  return UserSummary.findOneAndUpdate(
    { userId },
    { summary },
    { upsert: true, new: true }
  );
}

export async function getUserSummary(userId) {
  return UserSummary.findOne({ userId });
}