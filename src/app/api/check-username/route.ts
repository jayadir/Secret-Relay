import { connect } from "@/lib/db";
import User from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

export const GET = async (req: Request) => {
    await connect()
    try {
        const { searchParams } = new URL(req.url)
        const name = searchParams.get('name')
        const validation = usernameValidation.safeParse(name)
        if (!validation.success) {
            return Response.json({ success: false, message: "Invalid username" }, { status: 400 });
        }
        const existingUser = await User.findOne({ name,isVerified: true });
        if (existingUser) {
            return Response.json({ success: false, message: "Username already exists" }, { status: 400 });
        }
        return Response.json({ success: true, message: "Username is available" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Failed to signup" }, { status: 500 });
    }
}