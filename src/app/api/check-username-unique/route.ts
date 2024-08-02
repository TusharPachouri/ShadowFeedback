import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import {z} from 'zod'
import {usernameValidation} from '@/schema/signUpSchema'
import { METHODS } from "http"


const UserQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    // if(request.method !== 'GET'){ //**No need for this for the latest update of next js */
    //     return Response.json({
    //         success: false,
    //         message: "Only Get request is allowed to this route!!"
    //     },{
    //         status: 405
    //     })
    // }
    dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = { 
            username: searchParams.get('username')
        }
        const result = UserQuerySchema.safeParse(queryParams)
        // console.log('QueryParams check of username',result) //Todo: Remove
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : 'Invalid Query Parameter'
                },{status: 400 })
        }
        const {username} = result.data
        const existingVerifiedUsername = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUsername){
            return Response.json(
                {
                    success:false,
                    message: 'User already exists with the same username!!'
                },{
                    status:400
                }
            )
        }
        return Response.json({
            success: true,
            message: 'Username is Unique!!'
        },{
            status:200
        })
        
    } catch (error) {
        console.error('Error while checking the username! ', error);
        return Response.json(
            {
                success: false,
                message: 'Error while checking the username'
            },
            {
                status:500
            }
        )
    }
}