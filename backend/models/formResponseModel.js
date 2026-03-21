import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
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
    answers: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

const FormResponse = mongoose.model("FormResponse", formResponseSchema);
export default FormResponse;
