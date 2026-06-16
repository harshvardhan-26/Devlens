import mongoose from "mongoose";

const UserSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    summary: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const UserSummary =
  mongoose.model("UserSummary", UserSummarySchema);