import express from "express";
import { 
    getVolunteerForm, 
    saveVolunteerForm, 
    submitApplication, 
    getApplications, 
    updateApplicationStatus 
} from "../controllers/volunteerController.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Public Routes
router.get("/form", getVolunteerForm);
router.post("/apply", upload.single("resume"), submitApplication);

// Admin Routes
router.post("/form", isAuth, isAdmin, saveVolunteerForm);
router.get("/applications", isAuth, isAdmin, getApplications);
router.post("/applications/:id/status", isAuth, isAdmin, updateApplicationStatus);

export default router;
