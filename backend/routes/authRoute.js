import express from "express"
import rateLimit from "express-rate-limit"
import {googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp, verifyAuthOtp, getRecentStudents } from "../controllers/authController.js"

const authRouter = express.Router()

// Dedicated rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: "Too many authentication attempts, please try again after 15 minutes"
});

authRouter.post("/signup", authLimiter, signUp)
authRouter.post("/login", authLimiter, login)
authRouter.post("/logout", logOut) // Explicit POST logout
authRouter.post("/googlesignup", googleSignup)
authRouter.post("/sendotp", authLimiter, sendOtp)
authRouter.post("/verifyotp", authLimiter, verifyOtp)
authRouter.post("/verify-auth-otp", authLimiter, verifyAuthOtp)
authRouter.post("/resetpassword", authLimiter, resetPassword)
authRouter.get("/recent-students", getRecentStudents)

export default authRouter