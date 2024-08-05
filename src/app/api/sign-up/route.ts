import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";


export async function POST(request: Request){
    await dbConnect()
    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.find({
            username, isVerified : true
        })
        if(existingUserVerifiedByUsername.length > 0){
            return Response.json(
                {
                    success : false,
                    message: 'Username already been taken!'
                },{
                    status:400
                }
            )
        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(verifyCode)
        if(existingUserByEmail){
            //** back here **/
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "User exists with this same email!" 
                },{
                    status:400
                })
            }
            else{
                const hashPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
                username,
                password: hashPassword,
                email,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        //** Send Verification email**/
        const emailResponse = await SendVerificationEmail(
            email, 
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },{
                    status:500
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error while registering user!', error)
        return Response.json(
            {
            success: false,
            message: 'Error while registering user!'
            },
            {
                status: 500
            }
        )
    }
}