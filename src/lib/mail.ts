import { Resend } from "resend";
import VerificationMail from "@/templates/VerificationMail";
import { Response } from "@/types/responseType";
export const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
export const sendEmail = async (email: string, username: string, otp: string): Promise<Response> => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Email Verification",
            react: VerificationMail({ username, otp })
        })
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to send email" };
    }
}