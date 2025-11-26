import mongoose from "mongoose";

const DocSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: String,
  filePath: String,
  content: String  
});

export default mongoose.model("Document", DocSchema);
