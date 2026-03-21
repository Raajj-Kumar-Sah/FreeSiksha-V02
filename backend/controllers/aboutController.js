import AboutSettings from "../models/aboutSettingsModel.js";
import uploadOnCloudinary from "../configs/cloudinary.js";

export const getAboutSettings = async (req, res) => {
    try {
        let settings = await AboutSettings.findOne();
        if (!settings) {
            // Create default settings if not exists
            settings = await AboutSettings.create({
                backgroundPhotos: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655"],
                quotes: [{ text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" }],
                typingTexts: ["Empowering Education", "Bridging Skill Gaps", "Free Forever"],
                videoUrl: ""
            });
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Get about settings error:", error);
        res.status(500).json({ message: "Failed to fetch about settings" });
    }
};

export const updateAboutSettings = async (req, res) => {
    try {
        const { backgroundPhotos, quotes, typingTexts, videoUrl, title, subtitle, description } = req.body;
        
        let settings = await AboutSettings.findOne();
        if (!settings) {
            settings = new AboutSettings();
        }

        if (backgroundPhotos) settings.backgroundPhotos = backgroundPhotos;
        if (quotes) settings.quotes = quotes;
        if (typingTexts) settings.typingTexts = typingTexts;
        if (videoUrl) settings.videoUrl = videoUrl;
        if (title) settings.title = title;
        if (subtitle) settings.subtitle = subtitle;
        if (description) settings.description = description;

        await settings.save();
        res.status(200).json({ message: "About settings updated successfully", settings });
    } catch (error) {
        console.error("Update about settings error:", error);
        res.status(500).json({ message: "Failed to update about settings" });
    }
};

export const uploadAboutMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await uploadOnCloudinary(req.file.path);
        res.status(200).json({ url: result });
    } catch (error) {
        console.error("Upload about media error:", error);
        res.status(500).json({ message: "Media upload failed" });
    }
};
