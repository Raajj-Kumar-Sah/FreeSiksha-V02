import express from 'express';
import { getSettings, updateAboutVideo } from '../controllers/settingController.js';
import isAuth, { isAdmin } from '../middlewares/isAuth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public Route
router.get('/public', getSettings);

// Admin Only Route
router.post('/about-video', isAuth, isAdmin, upload.single('video'), updateAboutVideo);

export default router;
