import express from 'express';
import auth from '../middleware/auth.js';
import Progress from '../models/Progress.js';
import Video from '../models/Video.js';

const router = express.Router();

// mark completed
router.post('/complete', auth, async (req,res)=>{
  try{
    const userId = req.user.id;
    const { videoId, courseId } = req.body;
    if(!videoId||!courseId) return res.status(400).json({message:'videoId and courseId required'});
    const prev = await Progress.findOne({userId, videoId});
    if(prev){
      prev.completed = true;
      prev.completedAt = new Date();
      await prev.save();
      return res.json(prev);
    }
    const p = await Progress.create({userId, videoId, courseId, completed:true, completedAt:new Date()});
    res.json(p);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// get progress for course
router.get('/:courseId', auth, async (req,res)=>{
  try{
    const items = await Progress.find({userId:req.user.id, courseId:req.params.courseId}).populate('videoId');
    res.json(items);
  }catch(err){ res.status(500).json({error:err.message}); }
});

export default router;
