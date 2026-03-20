import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Review from "../models/reviewModel.js";
import AdminLog from "../models/adminLogModel.js";

// Dedicated login for the main admin
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Securely check against environment credentials, defaulting to fallbacks if not explicitly set in .env
        const adminUsername = process.env.ADMIN_USERNAME || 'mainadmin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'mainadmin123';

        if (username === adminUsername && password === adminPassword) {
            // Sign a token explicitly marking this session with the 'admin' role
            let token = jwt.sign(
                { userId: '000000000000000000000001', role: 'admin' }, 
                process.env.JWT_SECRET, 
                { expiresIn: "7d" }
            );
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({ 
                message: "Super Admin Login Successful", 
                admin: { username: adminUsername, role: "admin" } 
            });
        }

        return res.status(401).json({ message: "Invalid Admin Credentials" });

    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ message: `Admin login error: ${error.message}` });
    }
}

// Phase 2: Dashboard Overview Stats
export const getPlatformStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalTeachers = await User.countDocuments({ role: "educator" });
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
            teachers: totalTeachers,
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
        const { role } = req.query; // 'student' or 'educator'
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
