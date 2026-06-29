import mongoose, { Schema, Document } from "mongoose";

export interface ISkillCategory extends Document {
  name: string;
}

const SkillCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.SkillCategory || mongoose.model<ISkillCategory>("SkillCategory", SkillCategorySchema);
