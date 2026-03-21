import express from "express";
import { getAboutSettings, updateAboutSettings, uploadAboutMedia } from "../controllers/aboutController.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const aboutRouter = express.Router();

// Public route
aboutRouter.get("/settings", getAboutSettings);

// Admin routes
aboutRouter.post("/settings", isAuth, isAdmin, updateAboutSettings);
aboutRouter.post("/upload", isAuth, isAdmin, upload.single("media"), uploadAboutMedia);

export default aboutRouter;
