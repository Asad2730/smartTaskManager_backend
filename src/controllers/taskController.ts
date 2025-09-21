import type { Request, Response } from "express";
import { AppError } from "../utils/error";
import { taskSchema } from "../validators/taskValidator";
import { createtaskService, deleteTaskService, getTaskService, logTimeService, updateTaskService } from "../services/taskService";
import type { AuthRequest } from "../middlewares/authMiddleware";


export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { error } = taskSchema.validate(req.body)
        if (error) return res.status(404).json({ message: error.details[0]?.message, success: false })
        const task = await createtaskService({ ...req.body, user: req.user!.id })
        res.status(201).json({ task, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}


export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        let userId: string;
        if (req.headers['x-internal-request'] === 'true' && req.headers['x-user-id']) {
            userId = req.headers['x-user-id'] as string;
        } else {
            userId = req.user!.id;
        }
        const tasks = await getTaskService(userId, req.query,)
        res.status(200).json({ tasks, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}


export const updateTask = async (req: AuthRequest, res: Response) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required", success: false });
        }
        const task = await updateTaskService(req.params.id, req.user!.id, req.body)
        res.status(200).json({ task, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}


export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required", success: false });
        }
        const message = await deleteTaskService(req.params.id, req.user!.id)
        res.status(200).json({ message, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}



export const logTime = async (req: AuthRequest, res: Response) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required", success: false });
        }
        const { time } = req.body;
        if (!time || time <= 0) {
            return res.status(400).json({ message: "Time must be greater than 0", success: false });
        }

        const task = await logTimeService(req.params.id, req.user!.id, time)
        res.status(200).json({ message: "Time logged successfully", task });
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}