import {resend} from '@/lib/resend'
import VerificationEmail  from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'


export async function SendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message || Verification Code',
            react: VerificationEmail({username, otp : verifyCode}),
          });
        return {success: true, message: "Verification Email Successfully!"}
    } catch (error) {
        console.error("Error While Sending Verification Email", error)
        return {success: false, message: "Failed to send verification email!!!"}
    }
}