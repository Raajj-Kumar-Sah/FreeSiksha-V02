import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

// Free enrollment — no payment required
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.id || req.body.userId;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Enrollment failed" });
  }
};
