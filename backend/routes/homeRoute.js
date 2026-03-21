import express from "express";
import { getHomeSettings, updateHomeSettings } from "../controllers/homeController.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const homeRouter = express.Router();

// Public route
homeRouter.get("/settings", getHomeSettings);

// Admin route (multipart for media)
homeRouter.post("/settings", isAdmin, upload.fields([
    { name: 'heroVideo', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 }
]), updateHomeSettings);

export default homeRouter;
