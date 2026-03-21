import HomeSettings from "../models/homeSettingsModel.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const getHomeSettings = async (req, res) => {
    try {
        let settings = await HomeSettings.findOne();
        if (!settings) {
            settings = await HomeSettings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch homepage settings" });
    }
};

export const updateHomeSettings = async (req, res) => {
    try {
        const { 
            tagline, 
            heroTitleStatic, 
            heroWords, 
            heroTitleSuffix, 
            heroDescription, 
            socialProofCount 
        } = req.body;

        let settings = await HomeSettings.findOne();
        if (!settings) settings = new HomeSettings();

        if (tagline) settings.tagline = tagline;
        if (heroTitleStatic) settings.heroTitleStatic = heroTitleStatic;
        
        if (heroWords) {
            try {
                settings.heroWords = typeof heroWords === 'string' ? JSON.parse(heroWords) : heroWords;
            } catch (e) {
                console.warn("HeroWords parsing failed, using as is");
            }
        }

        if (heroTitleSuffix) settings.heroTitleSuffix = heroTitleSuffix;
        if (heroDescription) settings.heroDescription = heroDescription;
        if (socialProofCount) settings.socialProofCount = socialProofCount;

        // Handle File Uploads (Video/Image)
        if (req.files) {
            if (req.files.heroVideo) {
                const videoFile = req.files.heroVideo[0];
                const result = await cloudinary.v2.uploader.upload(videoFile.path, {
                    resource_type: "video",
                    folder: "home_media"
                });
                settings.heroVideoUrl = result.secure_url;
                // Delete local file
                if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
            }
            if (req.files.heroImage) {
                const imageFile = req.files.heroImage[0];
                const result = await cloudinary.v2.uploader.upload(imageFile.path, {
                    folder: "home_media"
                });
                settings.heroImageUrl = result.secure_url;
                // Delete local file
                if (fs.existsSync(imageFile.path)) fs.unlinkSync(imageFile.path);
            }
        }

        await settings.save();
        res.status(200).json({ message: "Homepage settings updated successfully", settings });
    } catch (error) {
        console.error("Home update error:", error);
        res.status(500).json({ message: "Failed to update homepage settings" });
    }
};
