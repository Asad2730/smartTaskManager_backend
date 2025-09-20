import type { Request, Response } from "express";
import { AppError } from "../utils/error";
import { taskSchema } from "../validators/taskValidator";
import { createtaskService, deleteTaskService, getTaskService, updateTaskService } from "../services/taskService";
import type { AuthRequest } from "../middlewares/authMiddleware";


export const createTask = async (req: Request, res: Response) => {
    try {
        const { error } = taskSchema.validate(req.body)
        if (error) return res.status(404).json({ message: error.details[0]?.message, success: false })
        const task = await createtaskService(req.body)
        res.status(201).json({ task, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}


export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const tasks = await getTaskService(req.user.id)
        res.status(200).json({ tasks, success: true })
    } catch (err) {
        const status = err instanceof AppError ? err.statusCode : 500;
        res.status(status).json({ message: err, success: false })
    }
}


export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
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
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
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
