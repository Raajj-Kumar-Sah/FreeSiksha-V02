import mongoose from "mongoose";

const volunteerApplicationSchema = new mongoose.Schema({
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
        of: mongoose.Schema.Types.Mixed // key: fieldName, value: user input
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const VolunteerApplication = mongoose.model("VolunteerApplication", volunteerApplicationSchema);
export default VolunteerApplication;
