import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask, logTime } from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";


const taskRoutes = Router();

taskRoutes.post("/", protect, createTask);
taskRoutes.get("/", protect, getTasks);
taskRoutes.put("/:id", protect, updateTask);
taskRoutes.delete("/:id", protect, deleteTask);
taskRoutes.post("/:id/log-time", protect, logTime);

export default taskRoutes;
