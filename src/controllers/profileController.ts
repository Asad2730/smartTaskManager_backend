import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import { changePasswordService, getProfileService, updateProfileService } from "../services/profileService";
import { AppError } from "../utils/error";

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        let userId: string;
        if (req.headers['x-internal-request'] === 'true' && req.headers['x-user-id']) {
            userId = req.headers['x-user-id'] as string;
        }else{
            userId = req.user!.id;
        }
        const user = await getProfileService(userId)
        res.status(200).json({ user, success: true });
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email } = req.body;
        const token = await updateProfileService(req.user!.id, name, email)
        res.status(200).json({ token, success: true });

    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await changePasswordService(req.user!.id, currentPassword, newPassword)
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }

};