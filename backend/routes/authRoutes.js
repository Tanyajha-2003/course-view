import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

router.post('/register', async (req,res)=>{
  try{
    const {name,email,password,role} = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({message:'Email exists'});
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await User.create({name,email,password:hashed, role: role || 'student'});
    res.status(201).json({message:'User created'});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email||!password) return res.status(400).json({message:'Missing fields'});
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message:'User not found'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({message:'Invalid credentials'});
    if(!process.env.JWT_SECRET) return res.status(500).json({message:'JWT_SECRET not configured'});
    const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'7d'});
    const safeUser = {_id:user._id, name:user.name, email:user.email, role:user.role};
    res.json({token, user: safeUser});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

export default router;
