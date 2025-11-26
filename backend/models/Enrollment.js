import mongoose from 'mongoose';
const EnrollmentSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
  enrolledAt:{type:Date, default:Date.now}
},{timestamps:true});
EnrollmentSchema.index({userId:1, courseId:1},{unique:true});
export default mongoose.model('Enrollment', EnrollmentSchema);
