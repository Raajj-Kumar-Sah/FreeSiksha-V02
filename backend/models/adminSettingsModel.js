import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        default: 'mainadmin'
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);
export default AdminSettings;
