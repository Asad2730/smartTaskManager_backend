import { Types } from "mongoose";
import type { ITask } from "../models/task";
import Task from "../models/task";
import User from "../models/user";
import { AppError } from "../utils/error";
import type QueryString from "qs";

export const createtaskService = async (task: Pick<ITask, 'title' | 'description' | 'dueDate' | 'status' | 'user'>): Promise<ITask> => {

    if (!Types.ObjectId.isValid(task.user)) throw new AppError("Invalid user ID", 400);

    const user = await User.findById(task.user).populate('subscription')
    if (!user) throw new AppError('user not found', 404)

    const hasPremium = user.role === 'premium' || (user.subscription &&
         (user.subscription as any).plan === 'premium' && (user.subscription as any).status === 'active');
    
         
    if (!hasPremium) {
        const taskCount = await Task.countDocuments({ user: user._id })
        if (taskCount >= 10) throw new AppError('Free users can only have up to 10 tasks ,Upgrade to Premium for unlimited tasks.', 403)
    }

    const newTask = await Task.create({ ...task, user: user._id })
    return (await newTask.populate("user", "email role")) as ITask;
}


export const getTaskService = async (userId:string, requestQuery: QueryString.ParsedQs): Promise<ITask[]> => {

    const { status, sortBy } = requestQuery;
    let query: any = { user: userId };
    if (status) query.status = status;
    let sort: any = { createdAt: -1 };
    if (sortBy === "dueDate") sort = { dueDate: 1 };
    if (sortBy === "timeSpent") sort = { timeSpent: -1 };
    return await Task.find(query).sort(sort)
}


export const updateTaskService = async (taskId: string, userId: string, task: Pick<ITask, 'title' | 'description' | 'dueDate' | 'status'>): Promise<ITask> => {
    if (!Types.ObjectId.isValid(taskId)) throw new AppError("Invalid task ID", 400);
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId, user: userId }, task, { new: true });
    if (!updatedTask) throw new AppError('Task not found', 404)
    return updatedTask
}


export const deleteTaskService = async (taskId: string, userId: string): Promise<string> => {
    if (!Types.ObjectId.isValid(taskId)) throw new AppError("Invalid task ID", 400);
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) throw new AppError('Task not found!', 404)
    return 'Task Deleted!'
}


export const logTimeService = async (taskId: string, userId: string, time: number): Promise<ITask> => {
    if (!Types.ObjectId.isValid(taskId)) throw new AppError("Invalid task ID", 400);
    const task = await Task.findOne({ _id: taskId, user: userId }).select('timeSpent');
    if (!task) throw new AppError('Task not found', 404)
    task.timeSpent += time
    return await task.save();
}