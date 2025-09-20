import type { Types } from "mongoose"
import Subscription, { type ISubscription } from "../models/subscription"
import User, { type IUser } from "../models/user"
import { AppError } from "../utils/error"



export const upgradeToPremiumService = async (userId: string):Promise<IUser> => {
    const user = await User.findById(userId)
    if (!user) throw new AppError('User not found', 404)

    let subscription = await Subscription.findOne({ user: user._id })

    if (subscription) {
        subscription.plan = 'premium';
        subscription.status = 'active';
        subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await subscription.save();
    } else {
        subscription = await Subscription.create({
            user: user._id,
            plan: 'premium',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
    }

    user.role = 'premium';
    user.subscription = subscription._id as Types.ObjectId;
    return await user.save()
}


export const getSubscriptionStatusService = async(userId:string):Promise<ISubscription | null>=>{
     return await Subscription.findOne({user:userId}).select('plan status currentPeriodEnd')
}