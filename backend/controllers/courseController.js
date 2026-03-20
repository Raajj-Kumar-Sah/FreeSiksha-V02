import uploadOnCloudinary from "../configs/cloudinary.js"
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { sendApprovalEmail } from "../configs/Mail.js"

// create Courses
export const createCourse = async (req,res) => {

    try {
        const {title,category} = req.body
        if(!title || !category){
            return res.status(400).json({message:"title and category is required"})
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        
        return res.status(201).json(course)
    } catch (error) {
         return res.status(500).json({message:`Failed to create course ${error}`})
    }
    
}

export const getPublishedCourses = async (req,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate("lectures reviews").sort({createdAt:-1})
        if(!courses)
        {
            return res.status(404).json({message:"Course not found"})
        }

        return res.status(200).json(courses)
        
    } catch (error) {
          return res.status(500).json({message:`Failed to get All  courses ${error}`})
    }
}


export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({creator:userId}).sort({createdAt:-1})
        if(!courses)
        {
            return res.status(404).json({message:"Course not found"})
        }
        return res.status(200).json(courses)
        
    } catch (error) {
        return res.status(500).json({message:`Failed to get creator courses ${error}`})
    }
}

export const editCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        let {title , subTitle , description , category , level , price , isPublished, zoomLink, registrationDeadline, formSchema } = req.body;
        if(isPublished !== undefined){
            isPublished = isPublished === "true" || isPublished === true;
        }
        // Validate deadline is in future if provided
        if(registrationDeadline && new Date(registrationDeadline) <= new Date()){
            return res.status(400).json({message:"Registration deadline must be a future date"})
        }
        let thumbnail
        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        // Auto-generate courseUniqueId when publishing for the first time
        let courseUniqueId = course.courseUniqueId;
        if(isPublished && !courseUniqueId){
            const year = new Date().getFullYear();
            const letter = (title || course.title || 'X').charAt(0).toUpperCase();
            // Count existing courseUniqueIds for this year to get sequence
            const count = await Course.countDocuments({ courseUniqueId: { $regex: `^FS-${year}-` } });
            const seq = String(count + 1).padStart(2, '0');
            courseUniqueId = `FS-${year}-${letter}-${seq}`;
        }
        // Parse formSchema if sent as string (multipart)
        let parsedFormSchema = formSchema;
        if(typeof formSchema === 'string'){
            try { parsedFormSchema = JSON.parse(formSchema); } catch(e) { parsedFormSchema = undefined; }
        }
        const updateData = {title, subTitle, description, category, level, price, isPublished, thumbnail, zoomLink, courseUniqueId}
        if(registrationDeadline) updateData.registrationDeadline = new Date(registrationDeadline);
        if(parsedFormSchema !== undefined) {
            updateData.formSchema = Array.isArray(parsedFormSchema) 
                ? parsedFormSchema.filter(f => f.label && f.label.trim() !== "") 
                : parsedFormSchema;
        }
        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true})
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({message:`Failed to update course ${error}`})
    }
}


export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
         return res.status(200).json(course)
        
    } catch (error) {
        return res.status(500).json({message:`Failed to get course ${error}`})
    }
}

export const manualEnroll = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name, email, phone, age, city, qualification, gender } = req.body;
        
        let course = await Course.findById(courseId);
        if(!course) return res.status(404).json({message: "Course not found"});

        let user = await User.findOne({ email });
        
        if (!user) {
            let phoneUser = await User.findOne({ phone });
            if (phoneUser) {
                return res.status(400).json({message: "A user with this phone number already exists under a different email."});
            }

            const year = new Date().getFullYear();
            const count = await User.countDocuments({ role: "student" });
            const seq = String(count + 1).padStart(4, '0');
            const studentId = `FS-STU-${year}-${seq}`;

            const rawPassword = Math.random().toString(36).slice(-8);
            const hashPassword = await bcrypt.hash(rawPassword, 10);

            user = await User.create({
                name, email, phone, age, city, qualification, gender,
                role: "student",
                studentId,
                password: hashPassword,
                isOtpVerifed: true
            });
        }

        if (course.enrolledStudents.includes(user._id)) {
            return res.status(400).json({message: "User is already enrolled in this course."});
        }

        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: user._id },
            $pull: { pendingStudents: user._id }
        });

        await User.findByIdAndUpdate(user._id, {
            $addToSet: { enrolledCourses: courseId },
            $pull: { pendingCourses: courseId }
        });

        return res.status(200).json({ message: "Student successfully enrolled!", user });
    } catch (error) {
        return res.status(500).json({message: `Failed to manually enroll student: ${error}`});
    }
}
export const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    return res.status(200).json({ message: "Course Removed Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:`Failed to remove course ${error}`})
  }
};



//create lecture

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle}= req.body
        const {courseId} = req.params

        if(!lectureTitle || !courseId){
             return res.status(400).json({message:"Lecture Title required"})
        }
        const lecture = await Lecture.create({lectureTitle})
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $push: { lectures: lecture._id } },
            { new: true, runValidators: false }
        ).populate("lectures");
        
        return res.status(201).json({lecture,course})
        
    } catch (error) {
        return res.status(500).json({message:`Failed to Create Lecture ${error}`})
    }
    
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId).populate("lectures")
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message:`Failed to get Lectures ${error}`})
    }
}

export const editLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const {isPreviewFree , lectureTitle} = req.body
        const lecture = await Lecture.findById(lectureId)
          if(!lecture){
            return res.status(404).json({message:"Lecture not found"})
        }
        let videoUrl
        if(req.file){
            videoUrl =await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
                }
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree
        
         await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({message:`Failed to edit Lectures ${error}`})
    }
    
}

export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if(!lecture){
             return res.status(404).json({message:"Lecture not found"})
        }
        //remove the lecture from associated course

        await Course.updateOne(
            {lectures: lectureId},
            {$pull:{lectures: lectureId}}
        )
        return res.status(200).json({message:"Lecture Remove Successfully"})
        }
    
     catch (error) {
        return res.status(500).json({message:`Failed to remove Lectures ${error}`})
    }
}



//get Creator data


// controllers/userController.js

export const getCreatorById = async (req, res) => {
  try {
    const {userId} = req.body;

    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json( user );
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "get Creator error" });
  }
};

// Request Enrollment in Free Course (Pending Approval)
export const enrollInFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;
    const { formResponses } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Block enrollment if registration deadline has passed
    if(course.registrationDeadline && new Date() > new Date(course.registrationDeadline)){
        return res.status(400).json({ message: "Registration is closed for this course. The deadline has passed." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    if (user.pendingCourses.includes(courseId)) {
      return res.status(400).json({ message: "Enrollment request already pending" });
    }

    // Add to pending queues
    user.pendingCourses.push(courseId);
    // Store form responses if provided
    if(formResponses && Object.keys(formResponses).length > 0){
        if(!user.formResponsesMap) user.formResponsesMap = {};
        user.formResponsesMap[courseId] = formResponses;
        user.markModified('formResponsesMap');
    }
    await user.save({ validateBeforeSave: false });

    course.pendingStudents.push(userId);
    await course.save();

    return res.status(200).json({ message: "Enrollment requested successfully! Waiting for teacher approval." });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Internal server error during enrollment request" });
  }
};

// Get Course Enrollments (Pending and Approved)
export const getCourseStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
            .populate('enrolledStudents', 'name email phone age city qualification gender createdAt')
            .populate('pendingStudents', 'name email phone age city qualification gender createdAt');

        if (!course) return res.status(404).json({ message: "Course not found" });

        // Ensure only the creator can view this list
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to view student list" });
        }

        res.status(200).json({
            enrolled: course.enrolledStudents,
            pending: course.pendingStudents
        });
    } catch (error) {
        console.error("Fetch students error:", error);
        res.status(500).json({ message: "Internal server error while fetching course students" });
    }
}

// Approve Student Enrollment
export const approveStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: Only the creator can approve students." });
        }

        const user = await User.findById(studentId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove from pending arrays
        course.pendingStudents = course.pendingStudents.filter(id => id.toString() !== studentId);
        user.pendingCourses = user.pendingCourses.filter(id => id.toString() !== courseId);

        // Add to enrolled arrays
        if (!course.enrolledStudents.includes(studentId)) course.enrolledStudents.push(studentId);
        if (!user.enrolledCourses.includes(courseId)) user.enrolledCourses.push(courseId);

        await course.save();
        await user.save();

        try {
            await sendApprovalEmail(user.email, course.title, user.name);
        } catch (mailError) {
            console.error("Failed to send approval email:", mailError);
        }

        res.status(200).json({ message: "Student approved successfully." });
    } catch (error) {
         console.error("Approve student error:", error);
         res.status(500).json({ message: "Internal server error while approving student" });
    }
}

// Reject Student Enrollment
export const rejectStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: Only the creator can reject students." });
        }

        const user = await User.findById(studentId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove from pending arrays explicitly
        course.pendingStudents = course.pendingStudents.filter(id => id.toString() !== studentId);
        user.pendingCourses = user.pendingCourses.filter(id => id.toString() !== courseId);

        await course.save();
        await user.save();

        res.status(200).json({ message: "Student enrollment request rejected." });
    } catch (error) {
         console.error("Reject student error:", error);
         res.status(500).json({ message: "Internal server error while rejecting student" });
    }
}

// Student Unenrolls / Cancels Pending Request from a Course
export const unenrollFromCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Use $pull to avoid re-triggering full Mongoose schema validation on save()
        await Course.findByIdAndUpdate(courseId, {
            $pull: { pendingStudents: userId, enrolledStudents: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $pull: { pendingCourses: courseId, enrolledCourses: courseId }
        });

        res.status(200).json({ message: "Unenrolled successfully." });
    } catch (error) {
         console.error("Unenroll error:", error);
         res.status(500).json({ message: "Internal server error during unenrollment" });
    }
}

// Teacher Removes a Student from a Course
export const removeCourseStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: Only the creator can remove students." });
        }

        const user = await User.findById(studentId);
        if (!user) return res.status(404).json({ message: "User not found" });

        course.enrolledStudents = course.enrolledStudents.filter(id => id.toString() !== studentId);
        user.enrolledCourses = user.enrolledCourses.filter(id => id.toString() !== courseId);

        await course.save();
        await user.save();

        res.status(200).json({ message: "Student removed from course." });
    } catch (error) {
         console.error("Remove student error:", error);
         res.status(500).json({ message: "Internal server error while removing student" });
    }
}

// Reopen Registration Date
export const reopenRegistration = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { newDeadline } = req.body;
        const userId = req.userId; // Teacher ID

        if (!newDeadline) return res.status(400).json({ message: "New deadline is required" });
        if (new Date(newDeadline) <= new Date()) return res.status(400).json({ message: "Deadline must be in the future" });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Security check
        if (course.creator.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the course creator can modify deadlines" });
        }

        course.registrationDeadline = new Date(newDeadline);
        await course.save();

        res.status(200).json({ message: "Registration reopened successfully", deadline: course.registrationDeadline });
    } catch (error) {
        console.error("Reopen registration error:", error);
        res.status(500).json({ message: "Failed to reopen registration" });
    }
};

// Get Course Analytics
export const getEnrollmentAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const course = await Course.findById(courseId).populate('enrolledStudents', 'gender createdAt');
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.creator.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const enrollments = course.enrolledStudents;
        const total = enrollments.length;
        const pending = course.pendingStudents.length;

        // Group by Gender
        const genderStats = Object.values(enrollments.reduce((acc, user) => {
            const gender = user.gender || 'Other';
            if (!acc[gender]) acc[gender] = { name: gender, value: 0 };
            acc[gender].value++;
            return acc;
        }, {}));

        // Group by Growth (daily)
        let enrollmentTrends = [];
        enrollments.forEach(u => {
            if(!u.createdAt) return;
            const date = new Date(u.createdAt);
            date.setHours(0,0,0,0);
            enrollmentTrends.push(date.toISOString().split('T')[0]);
        });

        const trendCount = enrollmentTrends.reduce((acc, date) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Convert to array sorted by date
        const sortedTrends = Object.keys(trendCount).sort().map(date => ({
            date,
            students: trendCount[date]
        }));

        res.status(200).json({ total, pending, genderStats, enrollmentTrends: sortedTrends });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};

