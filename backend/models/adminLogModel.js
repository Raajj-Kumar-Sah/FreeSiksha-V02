import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
        default: 'superadmin_id'
    },
    action: {
        type: String,
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    targetModel: {
        type: String,
        enum: ['User', 'Course', 'Enrollment', 'Review']
    },
    details: {
        type: String
    }
}, { timestamps: true });

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;
