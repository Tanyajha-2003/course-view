import express from "express";
import multer from "multer";
import fs from "fs";
import Document from "../models/Document.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

//Gemini Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//Upload Document
router.post("/upload/:courseId", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const courseId = req.params.courseId;
    const filePath = req.file.path;

    const text = fs.readFileSync(req.file.path, "utf8");

    const doc = await Document.create({
      courseId,
      title: req.file.originalname,
      filePath,
      content: text
    });

    res.json({ msg: "Uploaded", doc });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Upload error", error: err.message });
  }
});

// Get Docs for a Course
router.get("/course/:courseId", async (req, res) => {
  try {
    const docs = await Document.find({ courseId: req.params.courseId });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ msg: "Fetch error", error: err.message });
  }
});

// Summarise Document
router.post("/summarise", async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `Summarize this document in simple clear English:\n\n${text}`
    );

    const summary = result.response.text();

    res.json({ summary });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ msg: "AI Error", error: err.message });
  }
});

export default router;

