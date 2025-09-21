import { Router } from "express";
import { getMonthlySummary, chatQuery } from "../controllers/aiController";
import { protect } from "../middlewares/authMiddleware";

const aiRoutes = Router();

aiRoutes.get("/monthly-summary", protect, getMonthlySummary);
aiRoutes.post("/chat", protect, chatQuery);

export default aiRoutes;