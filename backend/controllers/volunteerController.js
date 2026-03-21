import VolunteerForm from "../models/volunteerFormModel.js";
import VolunteerApplication from "../models/volunteerApplicationModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import uploadOnCloudinary from "../configs/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendVolunteerSubmissionEmail, sendVolunteerApprovalEmail } from "../configs/Mail.js";

// GET /api/volunteer/form
export const getVolunteerForm = async (req, res) => {
    try {
        const form = await VolunteerForm.findOne({ isActive: true });
        if (!form) {
            return res.status(404).json({ message: "No active volunteer form found" });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// POST /api/volunteer/form (Admin Only)
export const saveVolunteerForm = async (req, res) => {
    try {
        const { fields } = req.body;
        let form = await VolunteerForm.findOne();
        if (form) {
            form.fields = fields;
            await form.save();
        } else {
            form = await VolunteerForm.create({ fields });
        }
        res.status(200).json({ message: "Volunteer form updated successfully", form });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// POST /api/volunteer/apply
export const submitApplication = async (req, res) => {
    try {
        const { name, email, responses } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and Email are required" });
        }

        let parsedResponses = {};
        try {
            parsedResponses = responses ? JSON.parse(responses) : {};
        } catch (e) {
            console.error("Failed to parse responses JSON:", e);
        }

        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult && uploadResult.url) {
                parsedResponses["resume"] = uploadResult.url;
            }
        }

        let userId = null;
        if (req.cookies.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                userId = decoded._id;
            } catch (err) { }
        }

        const application = await VolunteerApplication.create({ 
            userId, 
            name, 
            email, 
            responses: parsedResponses,
            role: "volunteer",
            status: "pending"
        });

        res.status(201).json({ message: "Application submitted successfully", application });
        
        // Background email dispatch
        try {
            await sendVolunteerSubmissionEmail(email, name);
        } catch (mailError) {
            console.error("Failed to send volunteer submission email:", mailError);
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// GET /api/volunteer/applications (Admin Only)
export const getApplications = async (req, res) => {
    try {
        const applications = await VolunteerApplication.find().sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// POST /api/volunteer/applications/:id/status (Admin Only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await VolunteerApplication.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (status === "approved" && application.status !== "approved") {
            // Check if user already exists
            let user = await User.findOne({ email: application.email });
            if (!user) {
                // Generate FS-VOL-ID
                const year = new Date().getFullYear();
                const count = await User.countDocuments({ role: "volunteer" });
                const seq = String(count + 1).padStart(4, '0');
                const volunteerUniqueId = `FS-VOL-${year}-${seq}`;

                // Generate a default password: Name (first 4 chars) + 123
                const rawPassword = (application.name.replace(/\s+/g, '').substring(0, 4).toLowerCase() || "vol") + "123";
                const hashedPass = await bcrypt.hash(rawPassword, 10);

                // Create user account on approval
                user = await User.create({
                    name: application.name,
                    email: application.email,
                    password: hashedPass,
                    role: "volunteer",
                    volunteerId: volunteerUniqueId,
                    status: "active",
                    isOtpVerifed: true, // Mark as verified since admin approved
                    age: application.responses.get("age") || 18,
                    city: application.responses.get("city") || "Unknown",
                    qualification: application.responses.get("qualification") || "Other",
                    phone: application.responses.get("phone") || "0000000000",
                    gender: application.responses.get("gender") || "Other"
                });
            } else {
                 user.role = "volunteer";
                 // If user exists, we might want to ensure they have a volunteerId
                 if (!user.volunteerId) {
                    const year = new Date().getFullYear();
                    const count = await User.countDocuments({ role: "volunteer" });
                    const seq = String(count + 1).padStart(4, '0');
                    user.volunteerId = `FS-VOL-${year}-${seq}`;
                 }
                 await user.save();
            }
        }

        application.status = status;
        await application.save();

        // Send approval email if approved
        if (status === "approved") {
            try {
                await sendVolunteerApprovalEmail(application.email, application.name);
            } catch (mailError) {
                console.error("Failed to send volunteer approval email:", mailError);
            }
        }

        res.status(200).json({ message: `Application ${status}`, application });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
