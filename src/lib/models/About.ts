import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  profileImage: string;
  name: string;
  story: string;
  resumeUrl: string;
}

const AboutSchema: Schema = new Schema(
  {
    profileImage: { type: String },
    name: { type: String, required: true },
    story: { type: String, required: true },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.About) {
  delete mongoose.models.About;
}

export default mongoose.model<IAbout>("About", AboutSchema);
