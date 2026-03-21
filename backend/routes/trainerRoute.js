import express from "express";
import { 
    getTrainerForm, 
    submitTrainerApplication, 
    updateTrainerForm, 
    getTrainerApplications, 
    approveTrainerApplication, 
    rejectTrainerApplication,
    setTrainerPassword
} from "../controllers/trainerController.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary upload dir

// Public Routes
router.get("/form", getTrainerForm);
router.post("/apply", upload.any(), submitTrainerApplication);
router.post("/set-password/:token", setTrainerPassword);

// Admin Routes (Protected)
router.get("/applications", isAuth, isAdmin, getTrainerApplications);
router.post("/form", isAuth, isAdmin, updateTrainerForm);
router.post("/approve/:id", isAuth, isAdmin, approveTrainerApplication);
router.post("/reject/:id", isAuth, isAdmin, rejectTrainerApplication);

export default router;
