import uploadOnCloudinary from "../configs/cloudinary.js"
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import User from "../models/userModel.js"

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
        let {title , subTitle , description , category , level , price , isPublished, zoomLink } = req.body;
        if(isPublished !== undefined){
            isPublished = isPublished === "true" || isPublished === true;
        }
        let thumbnail
         if(req.file){
            thumbnail =await uploadOnCloudinary(req.file.path)
                }
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        const updateData = {title , subTitle , description , category , level , price , isPublished ,thumbnail, zoomLink}

        course = await Course.findByIdAndUpdate(courseId , updateData , {new:true})
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
        const course = await Course.findById(courseId)
        if(course){
            course.lectures.push(lecture._id)
            
        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({lecture,course})
        
    } catch (error) {
        return res.status(500).json({message:`Failed to Create Lecture ${error}`})
    }
    
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }
        await course.populate("lectures")
        await course.save()
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

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    if (user.pendingCourses.includes(courseId)) {
      return res.status(400).json({ message: "Enrollment request already pending" });
    }

    // Add to pending queues instead of directly enrolling
    user.pendingCourses.push(courseId);
    await user.save();

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




