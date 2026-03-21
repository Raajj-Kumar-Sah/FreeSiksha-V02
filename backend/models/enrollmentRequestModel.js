import mongoose from "mongoose";

const enrollmentRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    formResponseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormResponse'
    }
}, { timestamps: true });

// Prevent duplicate pending requests
enrollmentRequestSchema.index({ studentId: 1, courseId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

const EnrollmentRequest = mongoose.model("EnrollmentRequest", enrollmentRequestSchema);
export default EnrollmentRequest;
