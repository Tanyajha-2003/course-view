import mongoose from 'mongoose';
const ProgressSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
  videoId:{type:mongoose.Schema.Types.ObjectId, ref:'Video', required:true},
  completed:{type:Boolean, default:false},
  completedAt:Date
},{timestamps:true});
ProgressSchema.index({userId:1, videoId:1},{unique:true});
export default mongoose.model('Progress', ProgressSchema);
