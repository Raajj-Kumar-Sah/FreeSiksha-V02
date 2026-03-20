import mongoose from "mongoose";

const volunteerFieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true
    },
    fieldType: {
        type: String,
        enum: ["text", "textarea", "select", "radio", "checkbox"],
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

const volunteerFormSchema = new mongoose.Schema({
    fields: [volunteerFieldSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const VolunteerForm = mongoose.model("VolunteerForm", volunteerFormSchema);
export default VolunteerForm;
