import dotenv from 'dotenv';
dotenv.config();
console.log("Loaded OPENAI KEY:", process.env.OPENAI_API_KEY ? "Yes" : "No");

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import docRoutes from './routes/docRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// ----------------
// Middleware
// ----------------
app.use(cors({
  origin: [
    "https://course-view-1.onrender.com",
    "https://course-view-1fd1.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ----------------
// API Routes
// ----------------
app.use("/api/payment", paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/docs', docRoutes);
app.use("/api/videos", courseRoutes);

// ----------------
// Serve React Frontend
// ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ----------------
// MongoDB & Server
// ----------------
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI missing in env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

