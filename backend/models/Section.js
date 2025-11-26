import mongoose from 'mongoose';
const SectionSchema = new mongoose.Schema({
  courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
  title:{type:String, required:true},
  order:{type:Number, default:0}
},{timestamps:true});
export default mongoose.model('Section', SectionSchema);
