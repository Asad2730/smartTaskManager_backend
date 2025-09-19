import { Schema, Document, model } from 'mongoose'


export interface IUser extends Document {
    email: string;
    password: string;
    role: 'free' | 'premium'
}


const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['free', 'premium'], default: 'free' }
    },
    { timestamps: true }
);


const User = model<IUser>('User',userSchema)

export default User
