import mongoose, { Schema, Document } from "mongoose";

export interface ISocial extends Document {
  platform: string;
  username: string;
  link: string;
}

const SocialSchema: Schema = new Schema(
  {
    platform: { type: String, required: true },
    username: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Social || mongoose.model<ISocial>("Social", SocialSchema);
