import mongoose from "mongoose";

const trainerFieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true
    },
    fieldType: {
        type: String,
        enum: ["text", "textarea", "select", "radio", "checkbox", "file"],
        default: "text"
    },
    required: {
        type: Boolean,
        default: false
    },
    validationType: {
        type: String,
        enum: ["none", "email", "number", "name", "tel"],
        default: "none"
    },
    options: [String] // For select fields
});

const trainerFormSchema = new mongoose.Schema({
    fields: [trainerFieldSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const TrainerForm = mongoose.model("TrainerForm", trainerFormSchema);
export default TrainerForm;
