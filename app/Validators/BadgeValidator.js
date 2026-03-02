"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const createBadgeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('iconPath').optional().isString().withMessage('iconPath must be a string'),
  body('goalId')
    .optional()
    .isInt().withMessage('goalId must be an integer')
    .custom(async (goalId) => {
      const goal = await db.Goal.findByPk(goalId);
      if (!goal) throw new Error('goalId does not exist');
    }),
];

const updateBadgeValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional(),
  body('iconPath').optional().isString().withMessage('iconPath must be a string'),
  body('goalId')
    .optional()
    .isInt().withMessage('goalId must be an integer')
    .custom(async (goalId) => {
      const goal = await db.Goal.findByPk(goalId);
      if (!goal) throw new Error('goalId does not exist');
    }),
];

module.exports = { createBadgeValidation, updateBadgeValidation };
