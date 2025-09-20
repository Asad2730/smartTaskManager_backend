import { Router } from "express";
import { upgradeToPremium, getSubscriptionStatus } from "../controllers/subscriptionController";
import { protect } from "../middlewares/authMiddleware";

const subscriptionRoutes = Router();

subscriptionRoutes.post("/upgrade", protect, upgradeToPremium);
subscriptionRoutes.get("/status", protect, getSubscriptionStatus);

export default subscriptionRoutes;