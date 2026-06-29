import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  domain: string;
  clientName: string;
  services: string[];
  liveDemoLink: string;
  challengeDescription: string;
  showOnHome: boolean;
  visibility: boolean;
  images: string[];
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    domain: { type: String },
    clientName: { type: String },
    services: { type: [String], default: [] },
    liveDemoLink: { type: String },
    challengeDescription: { type: String },
    showOnHome: { type: Boolean, default: false },
    visibility: { type: Boolean, default: false },
    images: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 3,
        "A project can have a maximum of 3 images",
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// To prevent Next.js HMR from caching the old schema without showOnHome
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model<IProject>("Project", ProjectSchema);
