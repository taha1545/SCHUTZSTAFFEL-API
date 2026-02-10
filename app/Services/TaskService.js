"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');

const createTask = async (data) => {
  return await db.Task.create({
    title: data.title,
    description: data.description,
    deadline: data.deadline,
    taskKey: data.taskKey,
    isUsedKey: data.isUsedKey || false,
    goalId: data.goalId,
  });
};

const getTaskById = async (id, includeRelations = false) => {
  const options = { where: { id } };
  if (includeRelations) {
    options.include = [
      { model: db.Goal },
      { model: db.User, through: { attributes: [] } },
    ];
  }
  const task = await db.Task.findOne(options);
  if (!task) throw new NotFoundError('Task not found');
  return task;
};

const getAllTasks = async (page = 1, limit = 15, includeRelations = false) => {
  const offset = (page - 1) * limit;
  const options = {
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };
  if (includeRelations) {
    options.include = [{ model: db.Goal }];
  }
  return await db.Task.findAndCountAll(options);
};

const getTasksByGoal = async (goalId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.Task.findAndCountAll({
    where: { goalId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: db.Goal }],
  });
};

const updateTask = async (id, data) => {
  const task = await getTaskById(id);
  await task.update(data);
  return task;
};

const deleteTask = async (id) => {
  const task = await getTaskById(id);
  await task.destroy();
  return task;
};

const assignTaskToUsers = async (taskId, userIds) => {
  const task = await getTaskById(taskId);
  const ids = Array.isArray(userIds) ? userIds : [userIds];
  const created = [];
  for (const userId of ids) {
    const [userTask] = await db.UserTask.findOrCreate({
      where: { taskId, userId },
      defaults: { status: 'Pending' },
    });
    created.push(userTask);
  }
  return { task, assigned: created };
};

module.exports = {
  createTask,
  getTaskById,
  getAllTasks,
  getTasksByGoal,
  updateTask,
  deleteTask,
  assignTaskToUsers,
};
