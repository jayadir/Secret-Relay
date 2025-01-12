import User from "@/model/User.model";
import { Message } from "@/model/User.model";
import { connect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
export const POST = async (req: Request) => {
    await connect();
    const {name,message}=await req.json()
    try {
        const user=await User.findOne({name})
        if(!user){
            return Response.json({success:false,message:"User not found"},{status:404})
        }
        if(!user.isAccepting){
            return Response.json({success:false,message:"User is not accepting messages"},{status:403})
        }
        const msg={
            message,
            createdAt:new Date()
        }
        user.messages.push(msg as Message)
        await user.save()
        return Response.json({success:true,message:"Message sent successfully"},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Failed to send message" }, { status: 500 });
    }
}