import Setting from '../models/settingModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Get Public Settings (No Auth required)
export const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({ aboutVideoUrl: "" });
        }
        res.json({ success: true, settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update About Video (Admin Only)
export const updateAboutVideo = async (req, res) => {
    try {
        const videoFile = req.file;
        if (!videoFile) {
            return res.status(400).json({ success: false, message: "No video file provided" });
        }

        // Upload Video to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "video", folder: "lms_platform_settings" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(videoFile.buffer);
        });

        const videoUrl = uploadResult.secure_url;

        // Update Singleton Document
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({ aboutVideoUrl: videoUrl });
        } else {
            settings.aboutVideoUrl = videoUrl;
            await settings.save();
        }

        res.json({ success: true, message: "About video updated successfully", settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to upload video" });
    }
};
