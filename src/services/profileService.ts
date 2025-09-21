import type { Types } from "mongoose";
import User, { type IUser } from "../models/user";
import { AppError } from "../utils/error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getProfileService = async (userId: string): Promise<IUser> => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new AppError('User not found!', 404)
    return user
}


export const updateProfileService = async (userId: string, name: string, email: string): Promise<string> => {
    const user = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) throw new AppError('User not found', 404)
    const userObj = { id: (user._id as Types.ObjectId).toString(), email: user.email, role: user.role }
    return jwt.sign(userObj, process.env.JWT_SECRET as string,
        { expiresIn: '1d' })
}


export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {

    if (!currentPassword || !newPassword) {
        throw new AppError("Current password and new password are required", 400);
    }

    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

}