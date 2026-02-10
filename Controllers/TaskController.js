"use strict";

const TaskResource = require('../app/Resource/TaskResource');
const TaskService = require('../app/Services/TaskService');

const createTask = async (req, res) => {
  const task = await TaskService.createTask(req.body);
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    task: TaskResource(task),
  });
};

const getTaskById = async (req, res) => {
  const includeRelations = req.query.include === 'relations';
  const task = await TaskService.getTaskById(req.params.id, includeRelations);
  res.status(200).json({
    success: true,
    task: TaskResource(task),
  });
};

const getAllTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const includeRelations = req.query.include === 'relations';
  const { count, rows } = await TaskService.getAllTasks(page, limit, includeRelations);
  res.status(200).json({
    success: true,
    tasks: rows.map(task => TaskResource(task)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const getTasksByGoal = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await TaskService.getTasksByGoal(req.params.goalId, page, limit);
  res.status(200).json({
    success: true,
    tasks: rows.map(task => TaskResource(task)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const updateTask = async (req, res) => {
  const task = await TaskService.updateTask(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    task: TaskResource(task),
  });
};

const deleteTask = async (req, res) => {
  await TaskService.deleteTask(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
};

const assignTask = async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { userId, userIds } = req.body;
  const ids = userIds != null ? userIds : (userId != null ? [userId] : []);
  if (!ids.length) {
    return res.status(400).json({
      success: false,
      message: 'Provide userId or userIds array',
    });
  }
  const { task, assigned } = await TaskService.assignTaskToUsers(taskId, ids);
  res.status(201).json({
    success: true,
    message: 'Task assigned successfully',
    taskId: task.id,
    assignedCount: assigned.length,
    assigned: assigned.map((ut) => ({ id: ut.id, userId: ut.userId, taskId: ut.taskId, status: ut.status })),
  });
};

module.exports = {
  createTask,
  getTaskById,
  getAllTasks,
  getTasksByGoal,
  updateTask,
  deleteTask,
  assignTask,
};
