"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');

const createUserTask = async (data) => {
  return await db.UserTask.create({
    userId: data.userId,
    taskId: data.taskId,
    status: data.status || 'Pending',
    keySubmitted: data.keySubmitted,
    note: data.note,
  });
};

const getUserTaskById = async (id, includeRelations = false) => {
  const options = { where: { id } };
  if (includeRelations) {
    options.include = [
      { model: db.User },
      { model: db.Task },
    ];
  }
  const userTask = await db.UserTask.findOne(options);
  if (!userTask) throw new NotFoundError('UserTask not found');
  return userTask;
};

const getAllUserTasks = async (page = 1, limit = 15, includeRelations = false) => {
  const offset = (page - 1) * limit;
  const options = {
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };
  if (includeRelations) {
    options.include = [
      { model: db.User },
      { model: db.Task },
    ];
  }
  return await db.UserTask.findAndCountAll(options);
};

const getUserTasksByUser = async (userId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserTask.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: db.Task }],
  });
};

const getUserTasksByTask = async (taskId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserTask.findAndCountAll({
    where: { taskId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: db.User }],
  });
};

const updateUserTask = async (id, data) => {
  const userTask = await getUserTaskById(id);
  if (data.status === 'Completed' && !userTask.completedAt) {
    data.completedAt = new Date();
  }
  await userTask.update(data);
  return userTask;
};

const deleteUserTask = async (id) => {
  const userTask = await getUserTaskById(id);
  await userTask.destroy();
  return userTask;
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
