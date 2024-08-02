import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";


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
    const userId = user._id 
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )
        if(!updatedUser){
            return Response.json({
                success:false,
                message: "Failed to update user status or accept message"
            },{
                status:401
            })
        }
        return Response.json({
            success:false,
            message: "User status or accept message updated"
        },{
            status:200
        })
    } catch (error) {
        console.error("Failed to update user status or accept message")
        return Response.json({
            success:false,
            message: "Failed to update user status or accept message"
        },{
            status:500
        })
    }
}

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User 
    if(!user){
        return Response.json({
            success:false,
            message: "User is not authenticated"
        },{
            status: 401
        })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message: "User not found"
            },{
                status:401
            })
        }
        return Response.json({
            success:true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        },{
            status:200
        })  
    } catch (error) {
        console.error("Failed to find user status of message accepting")
        return Response.json({
            success:false,
            message: "Failed to find user status of message accepting"
        },{
            status:500
        })
    }
}