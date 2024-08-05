import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";


export async function POST(request: Request){
    dbConnect()
    const {username , content} = await request.json()
    console.log(username, content)
    try {
        const user = await UserModel.findOne({ username: username }).exec();
        console.log(user)
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
        const newMessage = { content, createdAt: new Date() };
        // console.log(newMessage)

    // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
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