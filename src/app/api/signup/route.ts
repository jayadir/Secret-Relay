import { connect } from "../../../lib/db";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";

export const POST = async (req: Request) => {
    await connect()
    try {
        const { name, email, password } = await req.json();
        const verifiedUserExistingInDB = await User.findOne({ name, isVerified: true });
        if (verifiedUserExistingInDB) {
            return Response.json({ success: false, message: "User already exists" }, { status: 400 });
        }
        const existingEmail = await User.findOne({ email })
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingEmail) {
            if (existingEmail.isVerified) {
                return Response.json({ success: false, message: "Email already exists" }, { status: 400 });
            }
            else {
                existingEmail.password = await bcrypt.hash(password, 10);
                existingEmail.otp = otp;
                const expiry = new Date();
                expiry.setMinutes(expiry.getMinutes() + 15);
                existingEmail.otpExpires = expiry;
                await existingEmail.save();

            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes() + 15);
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires: expiry,
                messages: []
            });
            await newUser.save();
        }

        const response = await sendEmail(email, name, otp);
        if (response.success) {
            return Response.json({ success: true, message: "Email sent successfully" }, { status: 200 });
        }
        else {
            return Response.json({ success: false, message: "Failed to send email" }, { status: 500 });
        }
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Failed to signup" }, { status: 500 });
    }
}