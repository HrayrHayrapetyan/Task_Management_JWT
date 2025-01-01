import { compare } from "bcrypt";
import Task from "../models/Task.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

async function userTasks(req, res) {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId)
      .select("name")
      .select("role")
      .populate("tasks")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "Username not found" });
    }

    return res
      .status(200)
      .json({ username: user.name, tasks: user.tasks, role: user.role });
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }
}

async function getTask(req, res) {
  const taskId = req.params.taskId;
  const user = res.user;

  const task = await Task.findOne({ _id: taskId });

  if (!task) return res.status(404).json({ message: "Task not found" });

  return res.status(200).json({ data: task, role: user.role });
}

async function editTask(req, res) {
  const { taskName, description, dueDate, priority, assignedUser, id } =
    req.body;

  const formattedDate = new Date(dueDate);
  const currDate = new Date();
  currDate.setHours(0, 0, 0, 0);

  try {
    if (formattedDate < currDate) {
      return res
        .status(406)
        .json({ message: "Due date cannot be in the past" });
    }
    const user = await User.findOne({ name: assignedUser });

    if (!user) {
      return res.status(404).json({ message: "Username not found" });
    }
    if (user.role == 2) {
      return res
        .status(404)
        .json({ message: "Cannot assign a task to an Admin" });
    }

    const taskToModify = await Task.findOneAndUpdate(
      { _id: id },
      {
        name: taskName,
        description: description,
        dueDate: dueDate,
        priority: priority,
      },
      { new: true }
    );

    if (!taskToModify)
      return res.status(404).json({ message: "task not found to modify" });

    if (taskToModify.assignedUser != assignedUser) {
      const userWithNew = await User.findOneAndUpdate(
        { name: assignedUser },
        { $push: { tasks: taskToModify } },
        { new: true }
      );

      const userWithoutOld = await User.findOneAndUpdate(
        { name: taskToModify.assignedUser },
        { $pull: { tasks: taskToModify._id } },
        { new: true }
      );

      const taskWithNewUser = await Task.findOneAndUpdate(
        { _id: id },
        { assignedUser: assignedUser }
      );

      return res
        .status(200)
        .json({
          message: "task added for the new user , changed assigned user",
        });
    }

    return res.status(200).json({ message: "Task edited successfully" });
  } catch {
    return res.status(404).json({ message: "Error editing the task" });
  }
}

async function assignTask(req, res) {
  const { taskName, description, dueDate, priority, assignedUser } = req.body;

  try {
    const formattedDate = new Date(dueDate).toISOString().slice(0, 10);
    const compareDate = new Date(dueDate);
    const currDate = new Date();
    currDate.setHours(0, 0, 0, 0);
    if (compareDate < currDate) {
      return res
        .status(406)
        .json({ message: "Due date cannot be in the past" });
    }
    
    if (assignedUser==''){
      return res.status(404).json({message: 'You must choose an assignee'})
    }

    const checkRole = await User.findOne({ name: assignedUser }).select("role");
    if (checkRole && checkRole.role == 2) {
      return res
        .status(404)
        .json({ message: "Cannot assign a task to an Admin" });
    }
    if (!checkRole) {
      return res.status(404).json({ message: "Username not found" });
    }

    const assignedTask = await Task.create({
      name: taskName,
      description: description,
      dueDate: formattedDate,
      assignedUser: assignedUser,
      priority: priority,
    });

    const user = await User.findOneAndUpdate(
      { name: assignedUser },
      { $push: { tasks: assignedTask } },
      { new: true }
    );
 
    return res.status(200).json({ message: "task assigned successfully" });

  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error assigning a task to the user" });
  }
}

async function changeStatus(req, res) {
  const { changedOption, id } = req.body;

  const task = await Task.findByIdAndUpdate(
    { _id: id },
    { status: changedOption },
    { new: true }
  );

  if (!task)
    return res.status(404).json({ message: "task not found to update " });

  return res.status(200).json({ message: "Task status changed successfully" });
}

async function deleteTask(req, res) {
  const { id, user } = req.body;

  try {
    const deletingTask = await Task.findByIdAndDelete({ _id: id });
    const modifiedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { tasks: id } },
      { new: true }
    );

    if (!deletingTask)
      return res.status(404).json({ message: "Task wasn't found to delete " });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch {
    return res.status(404).json({ message: "Error deleting the task" });
  }
}

async function deleteUser(req, res) {
  const user = req.body;
  console.log("inside delete user for :", user);

  try {
    for (let task of user.tasks) {
      const deletedTask = await Task.findOneAndDelete({ _id: task._id });
    }
    const deletingUser = await User.findOneAndDelete({ _id: user._id });
    console.log("deleted the user ", deleteTask);

    if (!deletingUser)
      return res.status(404).json({ message: "user wasn't found" });

    return res.status(200).json({ message: "User deleted successfully" });
    
  } catch {
    return res.status(404).json({ message: "Error deleting the user" });
  }
}

export default {
  userTasks,
  getTask,
  editTask,
  assignTask,
  changeStatus,
  deleteTask,
  deleteUser,
};
