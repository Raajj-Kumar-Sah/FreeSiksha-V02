import VolunteerForm from "../models/volunteerFormModel.js";
import VolunteerApplication from "../models/volunteerApplicationModel.js";
import User from "../models/userModel.js";

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
        const application = await VolunteerApplication.create({ name, email, responses });
        res.status(201).json({ message: "Application submitted successfully", application });
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
                // Create user account on approval
                // Note: Password can be empty or set to a default (user can reset via OTP)
                user = await User.create({
                    name: application.name,
                    email: application.email,
                    role: "volunteer",
                    status: "active",
                    age: application.responses.get("age") || 18,
                    city: application.responses.get("city") || "Unknown",
                    qualification: application.responses.get("qualification") || "Other",
                    phone: application.responses.get("phone") || "0000000000",
                    gender: application.responses.get("gender") || "Other"
                });
            } else {
                 user.role = "volunteer";
                 await user.save();
            }
        }

        application.status = status;
        await application.save();

        res.status(200).json({ message: `Application ${status}`, application });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
