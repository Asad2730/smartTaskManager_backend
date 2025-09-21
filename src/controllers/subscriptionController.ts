import type { Response } from "express";
import { AppError } from "../utils/error";
import type { AuthRequest } from "../middlewares/authMiddleware";
import { getSubscriptionStatusService, upgradeToPremiumService } from "../services/subscriptionService";


export const upgradeToPremium = async (req: AuthRequest, res: Response) => {
    try {
        const user = await upgradeToPremiumService(req.user!.id)
        res.status(200).json({ message: 'Upgraded to Premium', user, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}


export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
    try {
        const subscription = await getSubscriptionStatusService(req.user!.id)
        if (!subscription) {
            return res.status(200).json({
                plan: 'free',
                status: 'inactive',
                currentPeriodEnd: null,
                success: true
            });
        }

        res.status(200).json({
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            success: true
        })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}