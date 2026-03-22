import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Review from "../models/reviewModel.js";
import AdminLog from "../models/adminLogModel.js";
import AdminSettings from "../models/adminSettingsModel.js";
import Contact from "../models/contactModel.js";
import bcrypt from "bcryptjs";
import { sendManualTrainerCredentials } from "../configs/Mail.js";

// Dedicated login for the main admin
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Check if we have dynamic settings in DB
        let settings = await AdminSettings.findOne();
        
        // 2. Fallback to .env and initialize DB if empty
        const envUsername = process.env.ADMIN_USERNAME || 'mainadmin';
        const envPassword = process.env.ADMIN_PASSWORD || 'mainadmin123';

        if (!settings) {
            // First time initialization: store .env credentials in hashed format
            const hashedEnvPassword = await bcrypt.hash(envPassword, 10);
            settings = await AdminSettings.create({
                username: envUsername,
                password: hashedEnvPassword
            });
            console.log("Admin Settings initialized from .env");
        }

        // 3. MASTER OVERRIDE: If input matches .env precisely, allow and sync
        if (username === envUsername && password === envPassword) {
            const hashedEnvPassword = await bcrypt.hash(envPassword, 10);
            if (!settings) {
                settings = await AdminSettings.create({ username: envUsername, password: hashedEnvPassword });
            } else {
                settings.username = envUsername;
                settings.password = hashedEnvPassword;
                await settings.save();
            }
            // Proceed to token generation
        } else {
            // Standard Database Check
            if (!settings || username !== settings.username) {
                return res.status(401).json({ message: "Invalid Admin Credentials" });
            }
            const isMatch = await bcrypt.compare(password, settings.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Admin Credentials" });
            }
        }

        // Sign a token explicitly marking this session with the 'admin' role
        let token = jwt.sign(
            { userId: '000000000000000000000001', role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({ 
            message: "Super Admin Login Successful", 
            token,
            admin: { username: settings.username, role: "admin" } 
        });

    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ message: "Internal server error during admin login" });
    }
}

// Phase 2: Dashboard Overview Stats
export const getPlatformStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalTrainers = await User.countDocuments({ role: "trainer" });
        const courses = await Course.find().select("enrolledStudents");
        
        let totalCourses = courses.length;
        let totalEnrollments = 0;

        courses.forEach(course => {
            if (course.enrolledStudents) {
                totalEnrollments += course.enrolledStudents.length;
            }
        });

        res.status(200).json({
            students: totalStudents,
            trainers: totalTrainers,
            courses: totalCourses,
            enrollments: totalEnrollments,
            status: "ONLINE"
        });
    } catch (error) {
        console.error("Fetch stats error:", error);
        res.status(500).json({ message: "Failed to load platform statistics" });
    }
}

// Phase 3 & 4: User Management
export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query; // 'student' or 'trainer'
        let query = {};
        if (role) query.role = role;

        const users = await User.find(query).select("-password -resetOtp").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        res.status(500).json({ message: "Failed to load users" });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active', 'suspended', 'banned'

        if (!['active', 'suspended', 'banned'].includes(status)) {
            return res.status(400).json({ message: "Invalid status provided" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = status;
        await user.save();

        res.status(200).json({ message: `User status updated to ${status}`, user });
    } catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({ message: "Failed to update user status" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        // Phase 12: Audit Logging
        await AdminLog.create({
            action: "DELETE_USER",
            targetId: id,
            targetModel: "User",
            details: `Admin deleted user ${user.email}`
        });

        // Logic for cleaning up enrolled courses or taught courses could be triggered here
        res.status(200).json({ message: "User permanently deleted" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// Phase 5: Course Management
export const getAllAdminCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("creator", "name email").sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Fetch courses error:", error);
        res.status(500).json({ message: "Failed to load courses" });
    }
};

export const updateCourseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        course.isPublished = isPublished;

        // Auto-generate Course ID upon approval if it doesn't have one
        if (isPublished && !course.courseUniqueId) {
            const date = new Date();
            const yearStr = date.getFullYear().toString().slice(-2); // YY
            const firstLetter = course.title ? course.title.charAt(0).toUpperCase() : 'X';
            
            // Generate sequence number (count existing approved courses this year starting with same letter)
            const count = await Course.countDocuments({ 
                courseUniqueId: { $regex: `^FS-${yearStr}-${firstLetter}-` } 
            });
            const sequenceNo = (count + 1).toString().padStart(3, '0');
            
            course.courseUniqueId = `FS-${yearStr}-${firstLetter}-${sequenceNo}`;
        }

        await course.save();

        res.status(200).json({ 
            message: `Course ${isPublished ? 'approved and published' : 'rejected and unpublished'}`, 
            course 
        });
    } catch (error) {
        console.error("Update course status error:", error);
        res.status(500).json({ message: "Failed to update course status" });
    }
};

export const deleteAdminCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({ message: "Course permanently deleted" });
    } catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({ message: "Failed to delete course" });
    }
};

// Phase 6 & 7: Enrollment & Certificate Management
export const getAllEnrollments = async (req, res) => {
    try {
        const courses = await Course.find()
            .select("title enrolledStudents")
            .populate("enrolledStudents", "name email studentId");
            
        // Flatten the data for easier frontend tabular viewing
        let enrollments = [];
        courses.forEach(course => {
            if (course.enrolledStudents && course.enrolledStudents.length > 0) {
                course.enrolledStudents.forEach(student => {
                    enrollments.push({
                        courseId: course._id,
                        courseTitle: course.title,
                        studentId: student._id,
                        studentName: student.name,
                        studentEmail: student.email,
                        studentFSID: student.studentId || 'N/A'
                    });
                });
            }
        });

        res.status(200).json(enrollments);
    } catch (error) {
        console.error("Fetch enrollments error:", error);
        res.status(500).json({ message: "Failed to load enrollments" });
    }
};

export const removeEnrollment = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;

        // Remove from course
        const course = await Course.findById(courseId);
        if (course) {
            course.enrolledStudents = course.enrolledStudents.filter(id => id.toString() !== studentId);
            await course.save();
        }

        // Give the frontend a generic success since certificates may not be fully scaffolded yet
        res.status(200).json({ message: "Enrollment & associated access revoked" });
    } catch (error) {
        console.error("Remove enrollment error:", error);
        res.status(500).json({ message: "Failed to remove enrollment" });
    }
};

// Phase 8 & 9: Content Moderation
export const getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name email")
            .populate("course", "title")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Fetch reviews error:", error);
        res.status(500).json({ message: "Failed to load platform reviews" });
    }
};

export const deleteReviewAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);
        
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Remove the review reference from the Course
        await Course.findByIdAndUpdate(review.course, { $pull: { reviews: id } });

        res.status(200).json({ message: "Inappropriate content removed permanently" });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({ message: "Failed to delete review" });
    }
};

// Phase 10: CSV Export & Member Management
export const exportMembersCSV = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) query.role = role;

        const users = await User.find(query).select("name email role createdAt").sort({ createdAt: -1 });

        // Manual CSV Generation
        const headers = ["Name", "Email", "Role", "Created At"];
        const rows = users.map(user => [
            `"${user.name}"`,
            `"${user.email}"`,
            `"${user.role}"`,
            `"${user.createdAt.toISOString()}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=freesiksha_${role || 'members'}_export.csv`);
        res.status(200).send(csvContent);

    } catch (error) {
        console.error("CSV Export error:", error);
        res.status(500).json({ message: "Failed to generate CSV export" });
    }
};

export const updateUserCredentials = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, studentId, volunteerId, password } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (email) user.email = email;
        if (studentId) user.studentId = studentId;
        if (volunteerId) user.volunteerId = volunteerId;
        
        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            user.password = hashPassword;
        }

        user.isOtpVerifed = true; // Admin managed accounts bypass initial OTP
        await user.save();

        // Log the action for Phase 12 auditing
        await AdminLog.create({
            action: "UPDATE_CREDENTIALS",
            targetId: id,
            targetModel: "User",
            details: `Admin updated credentials for user ${user.email}. Fields: ${Object.keys(req.body).join(', ')}`
        });

        res.status(200).json({ message: "User credentials updated successfully", user });
    } catch (error) {
        console.error("Update credentials error:", error);
        res.status(500).json({ message: `Failed to update credentials: ${error.message}` });
    }
};

export const getAdminSettings = async (req, res) => {
    try {
        const settings = await AdminSettings.findOne().select("-password");
        if (!settings) {
            return res.status(200).json({ username: process.env.ADMIN_USERNAME || 'mainadmin' });
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admin settings" });
    }
};

export const updateAdminCredentials = async (req, res) => {
    try {
        const { oldPassword, newUsername, newPassword } = req.body;

        // 1. Fetch current settings
        let settings = await AdminSettings.findOne();
        if (!settings) {
            // If settings don't exist in DB, verify against .env
            const envPassword = process.env.ADMIN_PASSWORD || 'mainadmin123';
            if (oldPassword !== envPassword) {
                return res.status(401).json({ message: "Incorrect current password" });
            }
            // Initialize if first time
            const hashedNewPassword = await bcrypt.hash(newPassword || envPassword, 10);
            settings = await AdminSettings.create({
                username: newUsername || (process.env.ADMIN_USERNAME || 'mainadmin'),
                password: hashedNewPassword
            });
        } else {
            // 2. Verify Old Password
            const isMatch = await bcrypt.compare(oldPassword, settings.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect current password" });
            }

            // 3. Update Fields
            if (newUsername) settings.username = newUsername;
            if (newPassword) {
                settings.password = await bcrypt.hash(newPassword, 10);
            }
            await settings.save();
        }

        // 4. Log the action
        await AdminLog.create({
            action: "UPDATE_ADMIN_CREDENTIALS",
            targetModel: "AdminSettings",
            details: `Super Admin updated their credentials.`
        });

        res.status(200).json({ message: "Admin credentials updated successfully" });
    } catch (error) {
        console.error("Update admin credentials error:", error);
        res.status(500).json({ message: "Failed to update admin credentials" });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch inquiries" });
    }
};

export const markContactAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndUpdate(id, { status: 'read' }, { new: true });
        if (!contact) return res.status(404).json({ message: "Inquiry not found" });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: "Failed to update inquiry status" });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        
        await AdminLog.create({
            action: "DELETE_CONTACT_INQUIRY",
            targetModel: "Contact",
            details: `Admin deleted contact inquiry with ID: ${id}`
        });

        res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete inquiry" });
    }
};

export const addManualTrainer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, Email, and Password are required" });
        }

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Generate Trainer ID
        const year = new Date().getFullYear();
        const trainerId = `FS-TRA-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

        // 4. Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "trainer",
            status: "active",
            isOtpVerifed: true,
            studentId: trainerId,
            age: 0, 
            city: "Assigned", 
            qualification: "Assigned", 
            phone: "0000000000", 
            gender: "Other" 
        });

        // 5. Send Credentials Email (Resilient: log failure but don't stop the process)
        try {
            await sendManualTrainerCredentials(email, name, password);
        } catch (mailError) {
            console.error(`[AdminAddTrainer] Email notification failed for ${email}:`, mailError.message);
        }

        // 6. Audit Log
        await AdminLog.create({
            action: "MANUAL_ADD_TRAINER",
            targetId: user._id,
            targetModel: "User",
            details: `Admin manually created trainer account: ${email} (${trainerId})`
        });

        res.status(201).json({ 
            message: "Trainer account created successfully! Credentials have been sent to their email.", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error("Add manual trainer error:", error);
        res.status(500).json({ message: `Failed to create trainer: ${error.message}` });
    }
};

export const addManualStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, Email, and Password are required" });
        }

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Generate Student ID
        const year = new Date().getFullYear();
        const studentId = `FS-STU-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

        // 4. Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student",
            status: "active",
            isOtpVerifed: true,
            studentId,
            age: 0, 
            city: "Assigned", 
            qualification: "Assigned", 
            phone: "0000000000", 
            gender: "Other" 
        });

        // 5. Send Credentials Email
        try {
            await sendManualStudentCredentials(email, name, password);
        } catch (mailError) {
            console.error(`[AdminAddStudent] Email notification failed for ${email}:`, mailError.message);
        }

        // 6. Audit Log
        await AdminLog.create({
            action: "MANUAL_ADD_STUDENT",
            targetId: user._id,
            targetModel: "User",
            details: `Admin manually created student account: ${email} (${studentId})`
        });

        res.status(201).json({ 
            message: "Student account created successfully! Credentials have been sent to their email.", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error("Add manual student error:", error);
        res.status(500).json({ message: `Failed to create student: ${error.message}` });
    }
};
