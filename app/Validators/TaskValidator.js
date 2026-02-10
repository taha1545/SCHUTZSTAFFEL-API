"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  body('taskKey').optional(),
  body('isUsedKey').optional().isBoolean().withMessage('isUsedKey must be boolean'),
  body('goalId')
    .optional()
    .isInt().withMessage('goalId must be an integer')
    .custom(async (goalId) => {
      const goal = await db.Goal.findByPk(goalId);
      if (!goal) throw new Error('goalId does not exist');
    }),
];

const updateTaskValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional(),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  body('taskKey').optional(),
  body('isUsedKey').optional().isBoolean().withMessage('isUsedKey must be boolean'),
  body('goalId')
    .optional()
    .isInt().withMessage('goalId must be an integer')
    .custom(async (goalId) => {
      const goal = await db.Goal.findByPk(goalId);
      if (!goal) throw new Error('goalId does not exist');
    }),
];

module.exports = { createTaskValidation, updateTaskValidation };
