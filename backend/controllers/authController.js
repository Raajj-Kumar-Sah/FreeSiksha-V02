import { genToken } from "../configs/token.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import sendMail from "../configs/Mail.js"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

export const signUp = async (req, res, next) => {
    try {
        let { name, email, password, roleValue, age, city, qualification, phone, gender } = req.body;
        const role = roleValue === "trainer" ? "trainer" : "student";

        // ✅ CRITICAL FIX: Validate BEFORE touching DB
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        let existUser = await User.findOne({ email });
        if (existUser) {
            if (existUser.isOtpVerifed) {
                return res.status(400).json({ message: "Email already registered" });
            }
            // Only delete unverified duplicate, now safe since email is already validated
            await User.deleteOne({ email });
        }

        let hashPassword = await bcrypt.hash(password, 10);

        // Use crypto.randomUUID for collision-safe IDs
        const year = new Date().getFullYear();
        const prefix = role === "trainer" ? "FS-TRA" : "FS-STU";
        const studentId = `${prefix}-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

        let user = await User.create({
            name, email, password: hashPassword, role, age, city,
            qualification, phone, gender, studentId, isOtpVerifed: false
        });

        const otp = generateOtp();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendMail(email, otp);
        return res.status(201).json({ message: "OTP sent to email", requireOtp: true, email });

    } catch (error) {
        console.error("signUp error:", error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        let { identifier, password } = req.body;

        let user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!user.isOtpVerifed) {
            const otp = generateOtp();
            user.resetOtp = otp;
            user.otpExpires = Date.now() + 5 * 60 * 1000;
            await user.save();
            await sendMail(user.email, otp);
            return res.status(200).json({ message: "OTP sent to your registered email.", requireOtp: true, email: user.email });
        }
        if (user.status === "pending") {
            return res.status(401).json({ message: "Your account is under review." });
        }
        if (!user.password) {
            return res.status(401).json({ message: "Account not activated. Check your email for the activation link." });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            if (user.role === "volunteer") {
                return res.status(400).json({ message: "Incorrect password. Contact Admin if you need help.", isVolunteer: true });
            }
            return res.status(400).json({ message: "Incorrect password" });
        }

        const otp = generateOtp();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();
        await sendMail(user.email, otp);

        return res.status(200).json({ message: "OTP sent to registered email.", requireOtp: true, email: user.email });

    } catch (error) {
        console.error("login error:", error);
        next(error);
    }
};

export const verifyAuthOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isOtpVerifed = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        let token = await genToken(user._id, user.role);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json(user);

    } catch (error) {
        console.error("verifyAuthOtp error:", error);
        next(error);
    }
};

export const logOut = async (req, res, next) => {
    try {
        res.clearCookie("token", cookieOptions);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};

export const googleSignup = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        // ✅ HIGH FIX: Always assign "student" — never trust role from client
        const role = "student";

        let user = await User.findOne({ email });

        if (!user) {
            const year = new Date().getFullYear();
            const studentId = `FS-STU-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

            user = await User.create({
                name, email, role, studentId,
                isOtpVerifed: true
            });
        }

        let token = await genToken(user._id, user.role);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json(user);

    } catch (error) {
        console.error("googleSignup error:", error);
        next(error);
    }
};

export const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOtp();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerifed = false;
        await user.save();
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("sendOtp error:", error);
        next(error);
    }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.isOtpVerifed = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified" });

    } catch (error) {
        console.error("verifyOtp error:", error);
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // ✅ MEDIUM FIX: Password strength validation
        if (!password || password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters with at least 1 letter and 1 number" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerifed) {
            return res.status(400).json({ message: "OTP verification required before resetting password" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.isOtpVerifed = false;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("resetPassword error:", error);
        next(error);
    }
};

export const getRecentStudents = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'student', photoUrl: { $ne: "" } })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('photoUrl name');
        return res.status(200).json(students);
    } catch (error) {
        console.error("getRecentStudents error:", error);
        next(error);
    }
};