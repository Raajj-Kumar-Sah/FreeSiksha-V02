import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
        default: '000000000000000000000001'
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
        enum: ['User', 'Course', 'Enrollment', 'Review', 'Contact', 'AdminSettings']
    },
    details: {
        type: String
    }
}, { timestamps: true });

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;
