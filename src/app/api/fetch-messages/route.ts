import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { connect } from "@/lib/db";
import User from "@/model/User.model";
import mongoose from "mongoose";
export const GET = async (req: Request) => {
    const session = await getServerSession(options);
    const user = session?.user;
    if (!session || !user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const id = new mongoose.Types.ObjectId(user?._id);
    await connect();
    try {
        const res = await User.aggregate([
            {
                $match: {
                    _id: id
                }
            }, {
                $unwind: "$messages"
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ]);
        if (!res || res.length === 0) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ success: true, messages: res[0].messages }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Internal Server Error while fetching accept message" }, { status: 500 });
    }
};
