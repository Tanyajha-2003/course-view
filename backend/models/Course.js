import mongoose from 'mongoose';
const CourseSchema = new mongoose.Schema({
  title:{type:String, required:true},
  description:String,
  thumbnail:String,
  level:String,
  language:String,
  batch:String,
  status:String
},{timestamps:true});
export default mongoose.model('Course', CourseSchema);
