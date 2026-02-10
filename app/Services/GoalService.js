"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');

const createGoal = async (data) => {
  return await db.Goal.create({
    name: data.name,
    description: data.description,
    duration: data.duration,
    domain: data.domain,
    teacherId: data.teacherId,
  });
};

const getGoalById = async (id, includeRelations = false) => {
  const options = { where: { id } };
  if (includeRelations) {
    options.include = [
      { model: db.Teacher },
      { model: db.Task },
    ];
  }
  const goal = await db.Goal.findOne(options);
  if (!goal) throw new NotFoundError('Goal not found');
  return goal;
};

const getAllGoals = async (page = 1, limit = 15, includeRelations = false) => {
  const offset = (page - 1) * limit;
  const options = {
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };
  if (includeRelations) {
    options.include = [
      { model: db.Teacher },
      { model: db.Task },
    ];
  }
  return await db.Goal.findAndCountAll(options);
};

const getGoalsByTeacher = async (teacherId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.Goal.findAndCountAll({
    where: { teacherId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: db.Task }],
  });
};

const updateGoal = async (id, data) => {
  const goal = await getGoalById(id);
  await goal.update(data);
  return goal;
};

const deleteGoal = async (id) => {
  const goal = await getGoalById(id);
  await goal.destroy();
  return goal;
};

module.exports = {
  createGoal,
  getGoalById,
  getAllGoals,
  getGoalsByTeacher,
  updateGoal,
  deleteGoal,
};
