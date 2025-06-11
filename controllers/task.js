import { task } from "../models/task.js";
import errorHandler from "../middlewares/error.js";

export const getMyTask = async (req, res, next) => {
  try {
    const Task = await task.find({ user: req.user._id });
    res.json({
      success: true,
      Task,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTask = async (req, res, next) => {
  try {
    const data = await task.find({});
    res.json({
      success: true,
      task: data,
    });
  } catch (error) {
    next(error);
  }
};

export const postTask = async (req, res, next) => {
  try {
    const { title, discription } = req.body;

    const Task = await task.create({
      title,
      discription,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Task is Entered",
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Task = await task.findById(id);
    if (!Task) return next(new errorHandler("Task not found", 400));
    Task.isCompleted = !Task.isCompleted;
    await Task.save();

    res.status(201).json({
      success: true,
      message: "Task is updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteParticularTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Task = await task.findById(id);
    if (!Task) return next(new errorHandler("Task not found", 400));
    await task.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
