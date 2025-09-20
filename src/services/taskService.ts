import { Types } from "mongoose";
import type { ITask } from "../models/task";
import Task from "../models/task";
import User from "../models/user";
import { AppError } from "../utils/error";

export const createtaskService = async (task: Pick<ITask, 'title' | 'description' | 'dueDate' | 'status' | 'user'>): Promise<ITask> => {

    if (!Types.ObjectId.isValid(task.user)) throw new AppError("Invalid user ID", 400);
    const user = await User.findById(task.user)
    if (!user) throw new AppError('user not found', 404)
    if (user.role === 'free') {
        const taskCount = await Task.countDocuments({ user: user._id })
        if (taskCount >= 10) throw new AppError('Free users can only have up to 10 tasks', 403)

    }

    const newTask = await Task.create({ ...task, user: user._id })
    return (await newTask.populate("user", "email role")) as ITask;
}


export const getTaskService = async (userId: string): Promise<ITask[]> => {
    if (!Types.ObjectId.isValid(userId)) throw new AppError("Invalid user ID", 400);
    return await Task.find({ user: userId }).sort({ createdAt: -1 })
}


export const updateTaskService = async (taskId: string, userId: string, task: Pick<ITask, 'title' | 'description' | 'dueDate' | 'status'>): Promise<ITask> => {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(taskId)) throw new AppError("Invalid user ID || task ID", 400);

    const updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: userId }, task, { new: true });

    if (!updatedTask) throw new AppError('Task not found', 404)

    return updatedTask
}


export const deleteTaskService = async (taskId: string, userId: string):Promise<string> => {

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(taskId)) throw new AppError("Invalid user ID || task ID", 400);

    const task = await Task.findOneAndDelete({_id:taskId,user:userId});
    if(!task) throw new AppError('Task not found!',404)
    return 'Task Deleted!'
}