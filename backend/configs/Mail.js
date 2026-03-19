import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


const sendMail=async (to,otp) => {
    transporter.sendMail({
        from:process.env.EMAIL,
        to:to,
        subject:"FreeSiksha Authentication Code",
        html:`<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #2563EB;">Welcome to FreeSiksha</h2>
                <p>Your one-time verification code is <b><span style="font-size: 24px;">${otp}</span></b>.</p>
                <p>It will expire in 5 minutes. Do not share this code with anyone.</p>
              </div>`
    })
}


export default sendMail