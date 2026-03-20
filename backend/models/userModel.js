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
      enum: ["educator", "student", "admin"],
      required: true
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active"
    },
    age: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    qualification: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
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
