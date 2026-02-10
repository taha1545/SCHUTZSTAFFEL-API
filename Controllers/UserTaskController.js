"use strict";

const UserTaskResource = require('../app/Resource/UserTaskResource');
const UserTaskService = require('../app/Services/UserTaskService');

const createUserTask = async (req, res) => {
  const userTask = await UserTaskService.createUserTask(req.body);
  res.status(201).json({
    success: true,
    message: 'UserTask created successfully',
    userTask: UserTaskResource(userTask),
  });
};

const getUserTaskById = async (req, res) => {
  const includeRelations = req.query.include === 'relations';
  const userTask = await UserTaskService.getUserTaskById(req.params.id, includeRelations);
  res.status(200).json({
    success: true,
    userTask: UserTaskResource(userTask),
  });
};

const getAllUserTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const includeRelations = req.query.include === 'relations';
  const { count, rows } = await UserTaskService.getAllUserTasks(page, limit, includeRelations);
  res.status(200).json({
    success: true,
    userTasks: rows.map(userTask => UserTaskResource(userTask)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const getUserTasksByUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await UserTaskService.getUserTasksByUser(req.params.userId, page, limit);
  res.status(200).json({
    success: true,
    userTasks: rows.map(userTask => UserTaskResource(userTask)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const getUserTasksByTask = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await UserTaskService.getUserTasksByTask(req.params.taskId, page, limit);
  res.status(200).json({
    success: true,
    userTasks: rows.map(userTask => UserTaskResource(userTask)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const updateUserTask = async (req, res) => {
  const userTask = await UserTaskService.updateUserTask(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'UserTask updated successfully',
    userTask: UserTaskResource(userTask),
  });
};

const deleteUserTask = async (req, res) => {
  await UserTaskService.deleteUserTask(req.params.id);
  res.status(200).json({
    success: true,
    message: 'UserTask deleted successfully',
  });
};

module.exports = {
  createUserTask,
  getUserTaskById,
  getAllUserTasks,
  getUserTasksByUser,
  getUserTasksByTask,
  updateUserTask,
  deleteUserTask,
};
