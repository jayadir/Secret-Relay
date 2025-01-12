import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { connect } from "@/lib/db";
import User from "@/model/User.model";

export const POST = async (req: Request) => {
    await connect();
    const session = await getServerSession(options);
    const user = session?.user;
    if (!session || !user) {
        return Response.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }
    const id = user?._id;
    const { acceptMessage } = await req.json();
    try {
        const res = await User.findByIdAndUpdate(id, { isAccepting: acceptMessage }, { new: true });
        if (!res) {
            return Response.json({ status: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ status: true, message: "Accept message updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ status: false, message: "Internal Server Error while updating accept message" }, { status: 500 });
    }
};

export const GET = async (req: Request) => {
    const session = await getServerSession(options);
    const user = session?.user;
    if (!session || !user) {
        return Response.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }
    const id = user?._id;
    await connect();
    try {
        const res = await User.findById(id);
        if (!res) {
            return Response.json({ status: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ status: true, isAccepting: res.isAccepting }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ status: false, message: "Internal Server Error while fetching accept message" }, { status: 500 });
    }
};
