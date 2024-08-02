import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function POST(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "Not Authorize or Authenticated"
        },{
            status:401
        })
    }
    const userId = new mongoose.Types.ObjectId(user._id) 
    try {
        const user = await UserModel.aggregate([
            {
                $match: {id: userId}
            },{
                $unwind : 'messages'
            },
            {
                $sort: {'messages.createdAt': -1}
            },
            {
                $group: {_id : "$_id",messages:  {$push : '$messages'} }
            }
        ])
        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found!"
            },{
                status: 401
            })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },{
            status:200
        })
    } catch (error) {
        console.error("An unexpected error occurred: ",error)
        return Response.json({
            success:false,
            message: 'An unexpected error occurred!!'
        },{
            status:500
        })
    }

}