import express from 'express';
import auth from '../middleware/auth.js';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Video from '../models/Video.js';

const router = express.Router();

// middleware to require admin
const requireAdmin = (req,res,next)=>{
  if(!req.user || req.user.role!=='admin') return res.status(403).json({message:'Admin only'});
  next();
};

router.post('/course', auth, requireAdmin, async (req,res)=>{
  try{
    const data = req.body;
    const c = await Course.create(data);
    res.json(c);
  }catch(err){ res.status(500).json({error:err.message}); }
});

router.post('/course/:id/section', auth, requireAdmin, async (req,res)=>{
  try{
    const s = await Section.create({courseId:req.params.id, ...req.body});
    res.json(s);
  }catch(err){ res.status(500).json({error:err.message}); }
});

router.post('/section/:id/video', auth, requireAdmin, async (req,res)=>{
  try{
    const v = await Video.create({sectionId:req.params.id, ...req.body});
    res.json(v);
  }catch(err){ res.status(500).json({error:err.message}); }
});

export default router;
