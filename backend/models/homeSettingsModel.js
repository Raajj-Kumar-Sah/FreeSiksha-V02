import mongoose from "mongoose";

const homeSettingsSchema = new mongoose.Schema({
    tagline: {
        type: String,
        default: "NON PROFIT EDUCATION"
    },
    heroTitleStatic: {
        type: String,
        default: "Free & Quality"
    },
    heroWords: [{
        type: String,
        default: ["Education", "Success", "Future", "Opportunity"]
    }],
    heroTitleSuffix: {
        type: String,
        default: "for All"
    },
    heroDescription: {
        type: String,
        default: "Empowering learners worldwide with accessible, high-quality education and industry-recognized certifications. Join 1M+ students today."
    },
    heroVideoUrl: {
        type: String
    },
    heroImageUrl: {
        type: String
    },
    socialProofCount: {
        type: Number,
        default: 1000000
    }
}, { timestamps: true });

const HomeSettings = mongoose.model("HomeSettings", homeSettingsSchema);
export default HomeSettings;
