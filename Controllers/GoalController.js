"use strict";

const GoalResource = require('../app/Resource/GoalResource');
const GoalService = require('../app/Services/GoalService');

const createGoal = async (req, res) => {
  const data = { ...req.body };
  if (req.user?.role === 'teacher' && req.user?.id) {
    data.teacherId = req.user.id;
  }
  const goal = await GoalService.createGoal(data);
  res.status(201).json({
    success: true,
    message: 'Goal created successfully',
    goal: GoalResource(goal),
  });
};

const getGoalById = async (req, res) => {
  const includeRelations = req.query.include === 'relations';
  const goal = await GoalService.getGoalById(req.params.id, includeRelations);
  res.status(200).json({
    success: true,
    goal: GoalResource(goal),
  });
};

const getAllGoals = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const includeRelations = req.query.include === 'relations';
  const { count, rows } = await GoalService.getAllGoals(page, limit, includeRelations);
  res.status(200).json({
    success: true,
    goals: rows.map(goal => GoalResource(goal)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const getGoalsByTeacher = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await GoalService.getGoalsByTeacher(req.params.teacherId, page, limit);
  res.status(200).json({
    success: true,
    goals: rows.map(goal => GoalResource(goal)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const updateGoal = async (req, res) => {
  const goal = await GoalService.updateGoal(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Goal updated successfully',
    goal: GoalResource(goal),
  });
};

const deleteGoal = async (req, res) => {
  await GoalService.deleteGoal(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Goal deleted successfully',
  });
};

module.exports = {
  createGoal,
  getGoalById,
  getAllGoals,
  getGoalsByTeacher,
  updateGoal,
  deleteGoal,
};
