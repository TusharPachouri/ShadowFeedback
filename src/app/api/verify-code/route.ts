import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    dbConnect()
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'Username not found'
                },{
                    status:500
                })
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: 'Account verified successfully'
                },{
                    status: 200
                })
        }else if (!isCodeValid){
            return Response.json(
                {
                    success: false,
                    message: 'Verification Code is Incorrect!!'
                },{
                    status:400
                })
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: 'Verification code is expired, Do sign up again to verify'
                },{
                    status:400
                })
        }

    } catch (error) {
        console.error('Error while Verifying user! ', error);
        return Response.json(
            {
                success: false,
                message: 'Error while Verifying user!'
            },
            {
                status:500
            }
        )
    }
}