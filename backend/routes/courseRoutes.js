import express from 'express';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import Video from '../models/Video.js';
import Enrollment from '../models/Enrollment.js';
import auth from '../middleware/auth.js';
import fs from "fs";   

const router = express.Router();

// list courses
router.get('/', async (req,res)=>{
  try{
    const courses = await Course.find().sort({createdAt:-1});
    res.json(courses);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// course preview with sections count
router.get('/:id', async (req,res)=>{
  try{
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).json({message:'Course not found'});
    const sections = await Section.find({courseId:course._id}).sort({order:1});
    res.json({course, sections});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// enroll
router.post('/:id/enroll', auth, async (req,res)=>{
  try{
    const userId = req.user.id;
    const courseId = req.params.id;
    await Enrollment.create({userId, courseId});
    res.json({message:'Enrolled successfully'});
  }catch(err){
    if(err.code===11000) return res.status(200).json({message:'Already enrolled'});
    res.status(500).json({error:err.message});
  }
});

// get sections (only if enrolled)
router.get('/:id/sections', auth, async (req,res)=>{
  try{
    const userId = req.user.id;
    const courseId = req.params.id;
    const enrolled = await Enrollment.findOne({userId, courseId});
    if(!enrolled) return res.status(403).json({message:'Not enrolled'});
    const sections = await Section.find({courseId}).sort({order:1});
    res.json(sections);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// get videos for a section (only if enrolled)
router.get('/section/:sectionId/videos', auth, async (req,res)=>{
  try{
    const userId = req.user.id;
    const sectionId = req.params.sectionId;
    const section = await Section.findById(sectionId);
    if(!section) return res.status(404).json({message:'Section not found'});
    const enrolled = await Enrollment.findOne({userId, courseId: section.courseId});
    if(!enrolled) return res.status(403).json({message:'Not enrolled'});
    const videos = await Video.find({sectionId}).sort({order:1});
    res.json(videos);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// get video by id
router.get('/video/:id', auth, async (req,res)=>{
  try{
    const video = await Video.findById(req.params.id);
    if(!video) return res.status(404).json({message:'Video not found'});
    const enrolled = await Enrollment.findOne({userId:req.user.id, courseId: video.courseId});
    if(!enrolled) return res.status(403).json({message:'Not enrolled'});
    res.json(video);
  }catch(err){ res.status(500).json({error:err.message}); }
});
router.get("/stream/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const filePath = video.filePath; 

    const range = req.headers.range;
    if (!range) {
      return res.status(400).send("Requires Range header");
    }

    const videoSize = fs.statSync(filePath).size;

    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

