import mongoose, { Schema, Document } from "mongoose";

export interface IJourney extends Document {
  joinedDate: string;
  completedDate: string;
  type: "Experience" | "Education";
  title: string;
  description: string;
  at?: {
    name?: string;
    url?: string;
  };
}

const JourneySchema: Schema = new Schema(
  {
    joinedDate: { type: String, required: true },
    completedDate: { type: String },
    type: { type: String, enum: ["Experience", "Education"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    at: {
      name: { type: String },
      url: {
        type: String,
        validate: {
          validator: function (v: string) {
            if (!v) return true;
            return /^https?:\/\//i.test(v);
          },
          message: (props: any) => `${props.value} is not a valid HTTP/HTTPS URL!`,
        },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Journey || mongoose.model<IJourney>("Journey", JourneySchema);
