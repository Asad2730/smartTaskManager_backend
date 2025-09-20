import { Schema, Document, model, Types } from 'mongoose'


export interface ISubscription extends Document {
    user: Types.ObjectId;
    status: 'active' | 'inactive' | 'canceled';
    plan: 'free' | 'premium';
    currentPeriodEnd: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}


const subscriptionSchema = new Schema<ISubscription>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        status: { type: String, enum: ['active', 'inactive', 'canceled'], default: 'active' },
        plan: { type: String, enum: ['free', 'premium'], default: 'free' },
        currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, 
        stripeCustomerId: String,
        stripeSubscriptionId: String
    },
    { timestamps: true }
);

const Subscription = model<ISubscription>('Subscription', subscriptionSchema)
export default Subscription