import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true
    },
    volunteerId: {
      type: String,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
      
    },
    description: {
      type: String
    },
    role: {
      type: String,
      enum: ["student", "trainer", "admin"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "suspended", "banned"],
      default: "pending",
    },
    age: {
      type: Number
    },
    city: {
      type: String
    },
    qualification: {
      type: String
    },
    phone: {
      type: String
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    photoUrl: {
      type: String,
      default: ""
    },
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    pendingCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    resetOtp:{
      type:String
    },
    otpExpires:{
      type:Date
    },
    isOtpVerifed:{
      type:Boolean,
      default:false
    },
    activationToken: {
      type: String
    },
    activationExpires: {
      type: Date
    },
    formResponsesMap: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // stores dynamic JSON schema answers mapped by courseId
      default: {}
    }
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
