import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { approveStudent, createCourse, createLecture, editCourse, editLecture, enrollInFreeCourse, getCourseById, getCourseLecture, getCourseStudents, getCreatorById, getCreatorCourses, getPublishedCourses, rejectStudent, removeCourse, removeLecture, unenrollFromCourse, removeCourseStudent, reopenRegistration, getEnrollmentAnalytics, manualEnroll, getTrainerEnrollmentRequests } from "../controllers/courseController.js"
import upload from "../middlewares/multer.js"

let courseRouter = express.Router()

courseRouter.post("/create",isAuth,createCourse)
courseRouter.get("/getpublishedcoures",getPublishedCourses)
courseRouter.get("/getcreatorcourses",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/removecourse/:courseId",isAuth,removeCourse)
courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
courseRouter.get("/getcourselecture/:courseId",isAuth,getCourseLecture)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/getcreator",isAuth,getCreatorById)

courseRouter.post("/enroll/:courseId", isAuth, enrollInFreeCourse);
courseRouter.get("/requests", isAuth, getTrainerEnrollmentRequests);
courseRouter.get("/:courseId/students", isAuth, getCourseStudents);
courseRouter.post("/:courseId/approve/:studentId", isAuth, approveStudent);
courseRouter.post("/:courseId/reject/:studentId", isAuth, rejectStudent);

courseRouter.post("/:courseId/unenroll", isAuth, unenrollFromCourse);
courseRouter.post("/:courseId/removestudent/:studentId", isAuth, removeCourseStudent);

// new lifecycle routes
courseRouter.post("/:courseId/reopen", isAuth, reopenRegistration);
courseRouter.get("/:courseId/analytics", isAuth, getEnrollmentAnalytics);

export default courseRouter