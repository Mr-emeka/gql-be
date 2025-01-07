import mongoose from "mongoose";

const HobbiesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("hobbies", HobbiesSchema);
