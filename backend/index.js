console.log("INDEX.JS TOP");

import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import aiRouter from "./routes/aiRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoute.js";
import settingRouter from "./routes/settingRoute.js";
import volunteerRouter from "./routes/volunteerRoute.js";
import aboutRouter from "./routes/aboutRoute.js";
import contactRouter from "./routes/contactRoute.js";
import homeRouter from "./routes/homeRoute.js";
import trainerRouter from "./routes/trainerRoute.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/settings", settingRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/about", aboutRouter);
app.use("/api/contact", contactRouter);
app.use("/api/home-page", homeRouter);
app.use("/api/trainer", trainerRouter);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ API Health Check Route (FIXED YOUR ISSUE)
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀",
  });
});

// ✅ 404 Handler (PRO LEVEL)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDb();
});