import { Schema, Document, model,Types } from 'mongoose'


export interface IUser extends Document {
    email: string;
    password: string;
    role: 'free' | 'premium';
    subscription:Types.ObjectId;
}


const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['free', 'premium'], default: 'free' },
        subscription : {type:Schema.Types.ObjectId, ref:'Subscription'}
    },
    { timestamps: true }
);


const User = model<IUser>('User',userSchema)

export default User
