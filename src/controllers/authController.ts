import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/authValidator";
import { loginService, registerService } from "../services/authService";
import { AppError } from "../utils/error";


export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0]?.message })
    await registerService(req.body)
    res.status(201).json({ message: 'User created', success: true })
  } catch (err) {
    const status = err instanceof AppError ? err.statusCode : 500;
    res.status(status).json({ message: err, success: false });
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0]?.message })
    const token = await loginService(req.body)
    res.status(200).json({ token, success: true })
  } catch (err) {
    const status = err instanceof AppError ? err.statusCode : 500;
    res.status(status).json({ message: err, success: false });
  }
}


