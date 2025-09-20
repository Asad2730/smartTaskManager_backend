import Joi from "joi";


export const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  dueDate: Joi.date(),
  status: Joi.string().valid("todo", "in-progress", "completed"),
});