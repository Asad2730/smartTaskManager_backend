import { model, Schema, Document, Types } from 'mongoose'

export interface ITask extends Document {
    user: Types.ObjectId;
    title: string;
    description: string;
    dueDate: Date;
    status: "todo" | "in-progress" | "completed";
    timeSpent: number;
}


const taskSchema = new Schema<ITask>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date },
        status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
        timeSpent: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Task = model<ITask>("Task",taskSchema)

export default Task;