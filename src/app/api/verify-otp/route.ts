import {connect} from "@/lib/db";
import User from "@/model/User.model";
export const POST = async (req: Request) => {
    await connect()
    try {
        const {name,otp}=await req.json()
        const user=await User.findOne({name})
        if(!user){
            return Response.json({success:false,message:"User not found"},{status:404})
        }
        if(user.otp!==otp){
            return Response.json({success:false,message:"Invalid OTP"},{status:400})
        }
        const currentTime=new Date()
        if(currentTime>user.otpExpires){
            return Response.json({success:false,message:"OTP expired"},{status:400})
        }
        user.isVerified=true
        await user.save()
        return Response.json({success:true,message:"OTP verified"},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Failed to verify OTP" }, { status: 500 });
    }
}