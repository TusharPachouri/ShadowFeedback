import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";


export async function POST(request: Request){
    dbConnect()
    const {username , content} = await request.json()
    try {
        const user = await UserModel.findOne(username)
        if(!user){
            return Response.json({
                success:false,
                message: 'User is not found'
            },{
                status:404
            })
        }
        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message: 'User is not accepting the messages'
            },{
                status:403
            })
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success:true,
            message: 'Message sent successfully'
        },{
            status:200
        })
    } catch (error) {
        console.error("Error while sending messages: ",error)
        return Response.json({
            success:false,
            message: 'Internal server messages!!'
        },{
            status:500
        })
    }
}