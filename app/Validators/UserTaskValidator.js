"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const createUserTaskValidation = [
  body('userId')
    .isInt().withMessage('userId must be an integer')
    .custom(async (userId) => {
      const user = await db.User.findByPk(userId);
      if (!user) throw new Error('userId does not exist');
    }),
  body('taskId')
    .isInt().withMessage('taskId must be an integer')
    .custom(async (taskId) => {
      const task = await db.Task.findByPk(taskId);
      if (!task) throw new Error('taskId does not exist');
    }),
  body('status')
    .optional()
    .isIn(['Pending', 'In-Progress', 'Completed']).withMessage('status must be one of: Pending, In-Progress, Completed'),
  body('keySubmitted').optional().isString().withMessage('keySubmitted must be a string'),
  body('note').optional().isString().withMessage('note must be a string'),
];

const updateUserTaskValidation = [
  body('status')
    .optional()
    .isIn(['Pending', 'In-Progress', 'Completed']).withMessage('status must be one of: Pending, In-Progress, Completed'),
  body('keySubmitted').optional().isString().withMessage('keySubmitted must be a string'),
  body('completedAt').optional().isISO8601().withMessage('completedAt must be a valid date'),
  body('note').optional().isString().withMessage('note must be a string'),
];

module.exports = { createUserTaskValidation, updateUserTaskValidation };
