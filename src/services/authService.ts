import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IUser } from "../models/user";
import User from "../models/user";
import { AppError } from "../utils/error";
import type { Types } from "mongoose";


export const registerService = async (user: Pick<IUser, 'email' | 'password'>): Promise<IUser> => {
    const existingUser = await User.findOne({ email: user.email.toLowerCase() }).select('email');
    if (existingUser) throw new AppError("User already exists", 400);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await User.create({ email: user.email.toLowerCase(), password: hashedPassword });
};


export const loginService = async (user: Pick<IUser, 'email' | 'password'>): Promise<string> => {

    const userFound = await User.findOne({ email: user.email.toLowerCase() })
    if (!userFound) throw new AppError(`Invalid Credentials`, 401)
    const isMatch = await bcrypt.compare(user.password, userFound.password)
    if (!isMatch) throw new AppError(`Invalid Credentials`, 401)
    const userObj = { id: (userFound._id as Types.ObjectId).toString(), email: userFound.email, role: userFound.role }
    return jwt.sign(userObj, process.env.JWT_SECRET as string,
        { expiresIn: '1d' })
}