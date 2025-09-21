import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import { chatQueryService, getMonthlySummaryService } from "../services/aiService";

export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({
                message: "Month and year are required",
                success: false
            });
        }

        const summary = await getMonthlySummaryService(
            req.user!.id,
            parseInt(month as string),
            parseInt(year as string)
        );

        res.status(200).json({ ...summary, success: true });
    } catch (err) {
        res.status(500).json({ 
            message: err, 
            success: false 
        });
    }
};

export const chatQuery = async (req: AuthRequest, res: Response) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({
                message: "Query is required",
                success: false
            });
        }

        const response = await chatQueryService(req.user!.id, query);
        res.status(200).json({ ...response, success: true });
    } catch (err) {
        res.status(500).json({ 
            message: err, 
            success: false 
        });
    }
};