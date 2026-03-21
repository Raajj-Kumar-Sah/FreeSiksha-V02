import mongoose from "mongoose";

const aboutSettingsSchema = new mongoose.Schema({
    backgroundPhotos: [{
        type: String,
        required: true
    }],
    quotes: [{
        text: String,
        author: String
    }],
    typingTexts: [String],
    videoUrl: {
        type: String
    },
    title: {
        type: String,
        default: "Empowering Education"
    },
    subtitle: {
        type: String,
        default: "for Everyone"
    },
    description: {
        type: String,
        default: "At freesiksha.com, we believe in providing free, quality education to all..."
    }
}, { timestamps: true });

const AboutSettings = mongoose.model("AboutSettings", aboutSettingsSchema);
export default AboutSettings;
