import mongoose, { Schema, Document, model } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean;
    messages: Message[];

}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

const UserSchema: Schema<User> = new Schema({
    username: { 
        type: String, 
        required: [true , "Username is required"], 
        trim: true,
        unique: true
    },
    password: { 
        type: String, 
        required: [true, "Password is required"]  
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please provide a valid email"]
    },
    verifyCode: { 
        type: String, 
        required: [true, "verifyCode is required"] 
    },
    verifyCodeExpires: { 
        type: Date, 
        required: [true, " verifyCodeExpires is required"] 
    },
    isVerified: { 
        type: Boolean,
        default: false
    },
    isAcceptingMessage: { 
        type: Boolean, 
        default: true
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;