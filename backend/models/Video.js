import mongoose from 'mongoose';
const VideoSchema = new mongoose.Schema({
  courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
  sectionId:{type:mongoose.Schema.Types.ObjectId, ref:'Section', required:true},
  title:{type:String, required:true},
  videoUrl:{type:String, required:true},
  duration:String,
  order:{type:Number, default:0}
},{timestamps:true});
export default mongoose.model('Video', VideoSchema);
