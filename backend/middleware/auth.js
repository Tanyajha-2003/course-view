import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const auth = async (req,res,next)=>{
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({message:'No token'});
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if(!user) return res.status(401).json({message:'Invalid token'});
    req.user = { id:user._id, role:user.role, details:user };
    next();
  } catch(err){
    return res.status(401).json({message:'Token invalid or expired'});
  }
};
export default auth;
