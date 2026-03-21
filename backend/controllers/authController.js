import { genToken } from "../configs/token.js"
import validator from "validator"

import bcrypt from "bcryptjs"
import User from "../models/userModel.js"

import sendMail from "../configs/Mail.js"


export const signUp=async (req,res)=>{
    try {
        let {name, email, password, roleValue, age, city, qualification, phone, gender}= req.body
        const role = roleValue === "trainer" ? "trainer" : "student";
        let existUser= await User.findOne({email})
        
        if(existUser){
            if (existUser.isOtpVerifed) {
                return res.status(400).json({message:"email already exists"})
            }
            // If exists but not verified, we can just delete it to recreate them, or update it
            await User.deleteOne({ email });
        }
        
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Please enter valid Email"})
        }
        if(!password || password.length < 8){
            return res.status(400).json({message:"Please enter a Strong Password"})
        }
        
        let hashPassword = await bcrypt.hash(password,10)
        
        // Generate FS-ID
        const year = new Date().getFullYear();
        const prefix = role === "trainer" ? "FS-TRA" : "FS-STU";
        const count = await User.countDocuments({ role });
        const seq = String(count + 1).padStart(4, '0');
        const studentId = `${prefix}-${year}-${seq}`;

        let user = await User.create({
            name, email, password: hashPassword, role, age, city, qualification, phone, gender,
            studentId,
            isOtpVerifed: false
        })

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5*60*1000;
        await user.save();
        
        // Send OTP internally to their email
        await sendMail(email, otp);

        return res.status(201).json({ message: "OTP sent to email", requireOtp: true, email })

    } catch (error) {
        console.log("signUp error")
        return res.status(500).json({message:`signUp Error ${error}`})
    }
}

export const login=async(req,res)=>{
    try {
        let { identifier, password }= req.body // identifier can be email or phone
        
        // Find by email or phone
        let user = await User.findOne({ 
             $or: [ { email: identifier }, { phone: identifier } ]
        })

        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
        if(!user.isOtpVerifed) {
            // Re-send OTP if they try to log in but never verified
            const otp = Math.floor(1000 + Math.random() * 9000).toString()
            user.resetOtp = otp;
            user.otpExpires = Date.now() + 5*60*1000;
            await user.save();
            await sendMail(user.email, otp);
            return res.status(200).json({ message: "OTP sent to your registered email to verify account.", requireOtp: true, email: user.email })
        }

        if (user.status === "pending") {
            return res.status(401).json({ message: "Your account is under review. You will be notified once approved." });
        }

        if (!user.password) {
            return res.status(401).json({ message: "Your account is approved but you haven't set your password. Please check your email for the activation link." });
        }

        let isMatch =await bcrypt.compare(password, user.password)
        if(!isMatch){
            if (user.role === "volunteer") {
                return res.status(400).json({ 
                    message: "Incorrect Password. Please contact Admin if you are having trouble logging in.",
                    isVolunteer: true 
                });
            }
            return res.status(400).json({message:"incorrect Password"})
        }

        // Generate Login OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5*60*1000;
        await user.save();
        
        // Send OTP to their email (even if they logged in with mobile, per user instructions)
        await sendMail(user.email, otp);
        
        return res.status(200).json({ message: "OTP sent to registered email.", requireOtp: true, email: user.email })

    } catch (error) {
        console.log("login error")
        return res.status(500).json({message:`login Error ${error}`})
    }
}

export const verifyAuthOtp = async (req,res) => {
    try {
        const {email, otp} = req.body
        const user = await User.findOne({email})
        
        if(!user || user.resetOtp !== otp || user.otpExpires < Date.now() ){
            return res.status(400).json({message:"Invalid or expired OTP"})
        }
        
        user.isOtpVerifed = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        let token = await genToken(user._id, user.role)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        return res.status(200).json(user)

    } catch (error) {
         return res.status(500).json({message:`Verify auth otp error ${error}`})
    }
}




export const logOut = async(req,res)=>{
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"logOut Successfully"})
    } catch (error) {
        return res.status(500).json({message:`logout Error ${error}`})
    }
}


export const googleSignup = async (req,res) => {
    try {
        const { name, email, role: roleInput } = req.body;
        const role = (roleInput && ["student", "trainer", "admin"].includes(roleInput)) ? roleInput : "student";
        
        let user = await User.findOne({ email });
        
        if (!user) {
            // Generate FS-ID for new Google user
            const year = new Date().getFullYear();
            const prefix = role === "trainer" ? "FS-TRA" : "FS-STU";
            const count = await User.countDocuments({ role });
            const seq = String(count + 1).padStart(4, '0');
            const studentId = `${prefix}-${year}-${seq}`;

            user = await User.create({
                name,
                email,
                role,
                studentId,
                isOtpVerifed: true // Google users are pre-verified
            });
        }
        let token =await genToken(user._id, user.role)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)


    } catch (error) {
        console.log(error)
         return res.status(500).json({message:`googleSignup  ${error}`})
    }
    
}

export const sendOtp = async (req,res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp=otp,
        user.otpExpires=Date.now() + 5*60*1000,
        user.isOtpVerifed= false 

        await user.save()
        await sendMail(email,otp)
        return res.status(200).json({message:"Email Successfully send"})
    } catch (error) {

        return res.status(500).json({message:`send otp error ${error}`})
        
    }
}

export const verifyOtp = async (req,res) => {
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now() ){
            return res.status(400).json({message:"Invalid OTP"})
        }
        user.isOtpVerifed=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res.status(200).json({message:"OTP varified "})


    } catch (error) {
         return res.status(500).json({message:`Varify otp error ${error}`})
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {email ,password } =  req.body
         const user = await User.findOne({email})
        if(!user || !user.isOtpVerifed ){
            return res.status(404).json({message:"OTP verfication required"})
        }

        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword
        user.isOtpVerifed=false
        await user.save()
        return res.status(200).json({message:"Password Reset Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Reset Password error ${error}`})
    }
}

export const getRecentStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student', photoUrl: { $ne: "" } })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('photoUrl name');
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({message:`Failed to get recent students: ${error}`});
    }
}