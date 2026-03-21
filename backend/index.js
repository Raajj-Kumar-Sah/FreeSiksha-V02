import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

// ✅ Trust Proxy (CRITICAL for Render + Rate Limiting)
app.set("trust proxy", 1);

// URL Normalizer: Express 5 is strict with paths. This cleans `//api/...` to `/api/...` before routing.
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/+/g, '/');
  }
  next();
});

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Generic rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://freesiksha.vercel.app"
].filter(Boolean).map(url => url.endsWith('/') ? url.slice(0, -1) : url);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || (origin && origin.includes('freesiksha') && origin.endsWith('.onrender.com'))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to prevent rendering blocks in dev/docker
})); 

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

// ✅ API Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy 🚀",
  });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Global Error Handler (NO RAW ERRORS EXPOSED)
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err.stack);
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    
    res.status(status).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Something went wrong" : message
    });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDb();
});