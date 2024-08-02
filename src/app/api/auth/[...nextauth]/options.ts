import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { error } from "console";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text ", placeholder: "Email Here!!" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect;
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                    ]
                    })
                    if(!user){
                        throw new Error("User not found with these credentials !(route.ts/line 28)")
                    }
                    if(!user.isVerified){
                        throw new Error(' Verify your account before login!! '  )
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Password is not correct!!")
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session,token }) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
            return session
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        }
    }
}