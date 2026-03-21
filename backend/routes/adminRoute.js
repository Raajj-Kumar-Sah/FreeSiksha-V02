import express from "express";
import { 
    adminLogin, 
    getPlatformStats, 
    getAllUsers, 
    updateUserStatus, 
    deleteUser,
    getAllAdminCourses,
    updateCourseStatus,
    deleteAdminCourse,
    getAllEnrollments,
    removeEnrollment,
    getAllReviewsAdmin,
    deleteReviewAdmin,
    exportMembersCSV,
    updateUserCredentials,
    getAdminSettings,
    updateAdminCredentials,
    getAllContacts,
    markContactAsRead,
    deleteContact
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAuth.js";

const adminRouter = express.Router();

// Phase 1: Admin Authentication
adminRouter.post("/login", adminLogin);

// Phase 2: Overview Stats
adminRouter.get("/stats", isAdmin, getPlatformStats);

// Phase 3 & 4: User Management
adminRouter.get("/users", isAdmin, getAllUsers);
adminRouter.put("/users/:id/status", isAdmin, updateUserStatus);
adminRouter.put("/users/:id/credentials", isAdmin, updateUserCredentials);
adminRouter.delete("/users/:id", isAdmin, deleteUser);

// Phase 5: Course Management
adminRouter.get("/courses", isAdmin, getAllAdminCourses);
adminRouter.put("/courses/:id/status", isAdmin, updateCourseStatus);
adminRouter.delete("/courses/:id", isAdmin, deleteAdminCourse);

// Phase 6 & 7: Enrollment Management
adminRouter.get("/enrollments", isAdmin, getAllEnrollments);
adminRouter.delete("/enrollments/:courseId/:studentId", isAdmin, removeEnrollment);

// Phase 8 & 9: Content Moderation
adminRouter.get("/reviews", isAdmin, getAllReviewsAdmin);
adminRouter.delete("/reviews/:id", isAdmin, deleteReviewAdmin);

// Phase 10: Platform Data Export
adminRouter.get("/export", isAdmin, exportMembersCSV);
 
// Phase 11 & 12: Admin Settings
adminRouter.get("/settings", isAdmin, getAdminSettings);
adminRouter.put("/settings", isAdmin, updateAdminCredentials);

// Phase 13: Contact Management
adminRouter.get("/contacts", isAdmin, getAllContacts);
adminRouter.put("/contacts/:id/read", isAdmin, markContactAsRead);
adminRouter.delete("/contacts/:id", isAdmin, deleteContact);

// Protected Verification Endpoint
adminRouter.get("/verify", isAdmin, (req, res) => {
    res.status(200).json({ message: "Admin token is strictly verified.", role: req.userRole });
});

export default adminRouter;
