import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    authorRole: {
        type: String,
        enum: ["educator", "trainer", "admin"],
        required: true
    },
    category: {
        type: String
    },
    hearts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
