import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure Brevo API Client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sender = { email: process.env.EMAIL || "no-reply@freesiksha.com", name: "FreeSiksha" };

if (!process.env.BREVO_API_KEY) {
    console.warn("[Brevo Warning] BREVO_API_KEY is missing in .env!");
}

const sendMail = async (to, otp) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "FreeSiksha Authentication Code";
        sendSmtpEmail.htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #2563EB;">Welcome to FreeSiksha</h2>
                    <p>Your one-time verification code is <b><span style="font-size: 24px;">${otp}</span></b>.</p>
                    <p>It will expire in 5 minutes. Do not share this code with anyone.</p>
                  </div>`;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: to }];

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] OTP sent to ${to}: ${data.messageId}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send OTP to ${to}:`, error.message);
        throw error;
    }
};

export const sendApprovalEmail = async (to, courseTitle, studentName, studentId) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = `🎉 Enrollment Approved: ${courseTitle}`;
        sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #10B981; margin-bottom: 16px;">Congratulations ${studentName}!</h2>
                    <p>We are excited to inform you that your enrollment request has been <b>approved</b>.</p>
                    
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #dcfce7; margin: 24px 0;">
                        <p style="margin: 0; font-size: 14px; color: #166534;">🎓 <b>Course:</b> ${courseTitle}</p>
                        <p style="margin: 8px 0 0; font-size: 14px; color: #166534;">🆔 <b>Your FS-ID:</b> <span style="font-family: monospace; font-weight: bold; background: #fff; padding: 2px 6px; border-radius: 4px;">${studentId}</span></p>
                    </div>
                    
                    <p>You can now log in to your dashboard to access the course materials and start your learning journey.</p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to My Dashboard</a>
                    </div>
                    
                    <p>Happy Learning! 🚀</p>
                    <p>Best Regards,<br/><strong>Team FreeSiksha</strong></p>
                </div>
            `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: to }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] Approval email sent to ${to}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send Approval email to ${to}:`, error.message);
        throw error;
    }
};

export const sendApplicationReceivedEmail = async (email, name) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "🚀 Application Received - FreeSiksha Trainer Role";
        sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #2563eb; margin-bottom: 16px;">Hello ${name},</h2>
                    <p>Your application to become a Trainer on <b>FreeSiksha</b> has been successfully submitted.</p>
                    <p>Our administration team is currently reviewing your details and uploaded documents. You will be notified via email once your application is approved.</p>
                    <p>Thank you for your interest in sharing your expertise with our community!</p>
                    <br/>
                    <p>Best Regards,<br/><strong>FreeSiksha Team</strong></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="font-size: 11px; color: #9ca3af; text-align: center;">This is an automated confirmation of your application submission.</p>
                </div>
            `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] Application confirmation sent to ${email}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send Application confirmation to ${email}:`, error.message);
        throw error;
    }
};

export const sendSetPasswordEmail = async (email, name, setPasswordLink) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "🎉 Congratulations! Your Trainer Account is Approved";
        sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #2563eb; margin-bottom: 16px;">Congratulations ${name}!</h2>
                    <p>Your Trainer account has been officially approved by the Admin.</p>
                    <p>To activate your account and access your dashboard, please set your password using the secure link below:</p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${setPasswordLink}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Set Your Password & Activate</a>
                    </div>
                    
                    <div style="background: #fff7ed; padding: 16px; border-radius: 8px; border: 1px solid #ffedd5; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #9a3412;"><strong>⌚ Security Notice:</strong> This link will expire in <b>15 minutes</b>. Once your password is set, you can log in and start managing your courses.</p>
                    </div>
                    
                    <p>We're excited to have you on board!</p>
                    <p>Best Regards,<br/><strong>FreeSiksha Team</strong></p>
                </div>
            `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] Set password link sent to ${email}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send Set password link to ${email}:`, error.message);
        throw error;
    }
};

export const sendTrainerRejectionEmail = async (email, reason, name) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "FreeSiksha - Trainer Application Update";
        sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #ef4444;">Update on your Application</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for your interest in joining **FreeSiksha** as a Trainer.</p>
                    <p>After reviewing your application, we regret to inform you that we cannot move forward at this time.</p>
                    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                    <p>We wish you all the best in your future endeavors.</p>
                    <p>Best Regards,<br/><strong>FreeSiksha Team</strong></p>
                </div>
            `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] Rejection email sent to ${email}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send Rejection email to ${email}:`, error.message);
        throw error;
    }
};

export const sendVolunteerSubmissionEmail = async (email, name) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Volunteer Application Submitted ✅";
        sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #9333ea; margin-bottom: 16px;">Hello ${name},</h2>
                    <p>Your volunteer application has been successfully submitted to <b>FreeSiksha</b>.</p>
                    <p>Our team will review your application and get back to you soon.</p>
                    <p>Thank you for your interest and willingness to contribute!</p>
                    <br/>
                    <p>Best regards,<br/><strong>Team FreeSiksha</strong></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="font-size: 11px; color: #9ca3af; text-align: center;">This is an automated confirmation of your application submission.</p>
                </div>
            `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] Volunteer sub confirmation sent to ${email}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send Volunteer sub confirmation to ${email}:`, error.message);
        throw error;
    }
};

export const sendVolunteerApprovalEmail = async (email, name) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Congratulations! You're Approved as a Volunteer 🎉";
        sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #10b981; margin-bottom: 16px;">Congratulations ${name}! 🎉</h2>
                    <p>We are happy to inform you that your application to become a Volunteer at <b>FreeSiksha</b> has been <b>successfully approved</b>.</p>
                    <p>We truly appreciate your interest and willingness to contribute. You are now officially a part of our volunteer community.</p>
                    <p>Our team may reach out to you soon with further details and opportunities.</p>
                    <p>Welcome aboard! 🚀</p>
                    <br/>
                    <p>Best regards,<br/><strong>Team FreeSiksha</strong></p>
                </div>
            `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo API] Volunteer approval sent to ${email}`);
    } catch (error) {
        console.error(`[Brevo Error] Failed to send Volunteer approval to ${email}:`, error.message);
        throw error;
    }
};

export default sendMail;