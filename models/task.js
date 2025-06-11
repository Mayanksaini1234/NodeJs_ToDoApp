import mongoose from "mongoose";

const task_schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  discription: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  // Authenticated user is done by  this 
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const task = mongoose.model("tasks", task_schema);
