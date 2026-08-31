import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  category: string;
  items: string[];
}

const SkillSchema: Schema = new Schema(
  {
    category: { type: String, required: true },
    items: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
