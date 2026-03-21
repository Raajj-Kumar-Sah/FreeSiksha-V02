import mongoose from "mongoose";

const trainerApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // User might not have account yet
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    responses: {
        type: Map,
        of: mongoose.Schema.Types.Mixed // key: fieldName, value: user input or Cloudinary URL
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    rejectionReason: {
        type: String
    }
}, { timestamps: true });

const TrainerApplication = mongoose.model("TrainerApplication", trainerApplicationSchema);
export default TrainerApplication;
