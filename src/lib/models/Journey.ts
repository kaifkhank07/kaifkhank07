import mongoose, { Schema, Document } from "mongoose";

export interface IJourney extends Document {
  joinedDate: string;
  completedDate: string;
  type: "Experience" | "Education";
  title: string;
  description: string;
}

const JourneySchema: Schema = new Schema(
  {
    joinedDate: { type: String, required: true },
    completedDate: { type: String },
    type: { type: String, enum: ["Experience", "Education"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Journey || mongoose.model<IJourney>("Journey", JourneySchema);
