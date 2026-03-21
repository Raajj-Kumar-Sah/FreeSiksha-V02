import TrainerForm from "../models/trainerFormModel.js";
import jwt from "jsonwebtoken";
import TrainerApplication from "../models/trainerApplicationModel.js";
import User from "../models/userModel.js";
import uploadOnCloudinary from "../configs/cloudinary.js";
import bcrypt from "bcryptjs";
import { sendSetPasswordEmail, sendTrainerRejectionEmail, sendApplicationReceivedEmail, sendManualTrainerCredentials } from "../configs/Mail.js";
import crypto from "crypto";

// GET /api/trainer/form
export const getTrainerForm = async (req, res) => {
    try {
        const form = await TrainerForm.findOne({ isActive: true });
        if (!form) {
            // Create a default form if none exists
            const defaultFields = [
                { fieldName: "Full Name", fieldType: "text", required: true },
                { fieldName: "Email", fieldType: "text", required: true, validationType: "email" },
                { fieldName: "Experience (in years)", fieldType: "text", required: true, validationType: "number" },
                { fieldName: "Skills / Expertise", fieldType: "textarea", required: true },
                { fieldName: "Resume Upload", fieldType: "file", required: true }
            ];
            const newForm = await TrainerForm.create({ fields: defaultFields });
            return res.status(200).json(newForm);
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// POST /api/trainer/apply
export const submitTrainerApplication = async (req, res) => {
    try {
        const { name, email, responses: responsesJson } = req.body;
        const responses = JSON.parse(responsesJson || "{}");
        
        if (!name || !email) {
            return res.status(400).json({ message: "Name and Email are required" });
        }

        // Handle file uploads (Multer upload.any() provides an array in req.files)
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    responses[file.fieldname] = uploadResult;
                }
            }
        }

        console.log(`[TrainerApply] Creating application record for ${email}`);
        const application = await TrainerApplication.create({ 
            name, 
            email, 
            responses,
            status: "pending"
        });

        console.log(`[TrainerApply] Application created: ${application._id}. Checking for user account...`);
        // Create a pending user account
        let user = await User.findOne({ email });
        if (!user) {
            console.log(`[TrainerApply] Creating new pending user for ${email}`);
            // Generate a temporary password
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPass = await bcrypt.hash(tempPassword, 10);
            
            user = await User.create({
                name,
                email,
                password: hashedPass,
                role: "trainer",
                status: "pending",
                isOtpVerifed: true, 
                age: 0, 
                city: "Pending", 
                qualification: "Pending", 
                phone: "0000000000", 
                gender: "Other" 
            });
        } else {
            console.log(`[TrainerApply] Existing user found. Updating role to trainer.`);
            user.role = "trainer";
            user.status = "pending";
            await user.save();
        }

        application.userId = user._id;
        await application.save();

        // Send confirmation email to applicant (Non-critical, don't fail the whole request if email service has issues)
        try {
            await sendApplicationReceivedEmail(email, name);
        } catch (mailError) {
            console.error(`[TrainerApply] Non-critical email failure for ${email}:`, mailError.message);
        }

        console.log(`[TrainerApply] Submission complete for ${email}`);
        res.status(201).json({ message: "Application submitted successfully and is under review.", application });
    } catch (error) {
        console.error("Submit trainer application error:", error);
        res.status(500).json({ message: "Submission Error", error: error.message });
    }
}

// Admin Controllers

export const updateTrainerForm = async (req, res) => {
    try {
        const { fields } = req.body;
        let form = await TrainerForm.findOne();
        if (form) {
            form.fields = fields;
            await form.save();
        } else {
            form = await TrainerForm.create({ fields });
        }
        res.status(200).json({ message: "Trainer registration form updated successfully", form });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getTrainerApplications = async (req, res) => {
    try {
        const applications = await TrainerApplication.find({ status: "pending" }).sort({ createdAt: -1 }).lean();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const approveTrainerApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { resend } = req.body;

        const application = await TrainerApplication.findById(id);
        if (!application) return res.status(404).json({ message: "Application not found" });

        if (application.status !== "pending" && !resend) {
            return res.status(400).json({ message: "This application has already been processed" });
        }

        const user = await User.findById(application.userId);
        if (!user) return res.status(404).json({ message: "User account not found" });

        // Generate a random 8-character password for immediate access
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPass = await bcrypt.hash(tempPassword, 10);

        // Update user status and roles (Active immediately)
        user.status = "active";
        user.password = hashedPass;
        user.isOtpVerifed = true; 
        
        // Generate Trainer ID if not already generated
        if (!user.studentId || !user.studentId.startsWith("FS-TRA")) {
            const year = new Date().getFullYear();
            const trainerId = `FS-TRA-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
            user.studentId = trainerId;
        }
        
        user.role = 'trainer';
        await user.save();

        application.status = "approved";
        await application.save();

        // Send Email with credentials (using the working manual trainer template)
        try {
            await sendManualTrainerCredentials(application.email, user.name, tempPassword);
        } catch (mailError) {
            console.error(`[ApproveTrainer] Email notification failed for ${application.email}:`, mailError.message);
        }

        res.status(200).json({ message: "Application approved! Trainer is now active and credentials have been emailed.", application });
    } catch (error) {
        console.error("Approve trainer error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const setTrainerPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        const user = await User.findOne({
            activationToken: token,
            activationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired activation link." });
        }

        // Hash new password and activate account
        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        user.status = "active";
        user.activationToken = undefined;
        user.activationExpires = undefined;
        user.isOtpVerifed = true; // Mark as verified since they came from a secure email link

        await user.save();

        res.status(200).json({ message: "Password set successfully! You can now log in." });
    } catch (error) {
        console.error("Set trainer password error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const rejectTrainerApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const application = await TrainerApplication.findById(id);
        if (!application) return res.status(404).json({ message: "Application not found" });

        const user = await User.findById(application.userId);
        if (user) {
            user.status = "suspended"; // Keep account but suspend it
            await user.save();
        }

        application.status = "rejected";
        application.rejectionReason = reason;
        await application.save();

        // Send Email
        await sendTrainerRejectionEmail(application.email, reason);

        res.status(200).json({ message: "Application rejected and notification sent", application });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
