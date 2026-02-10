"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const createGoalValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('domain').optional(),
  body('teacherId')
    .optional()
    .isInt().withMessage('teacherId must be an integer')
    .custom(async (teacherId) => {
      const teacher = await db.Teacher.findByPk(teacherId);
      if (!teacher) throw new Error('teacherId does not exist');
    }),
];

const updateGoalValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional(),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('domain').optional(),
  body('teacherId')
    .optional()
    .isInt().withMessage('teacherId must be an integer')
    .custom(async (teacherId) => {
      const teacher = await db.Teacher.findByPk(teacherId);
      if (!teacher) throw new Error('teacherId does not exist');
    }),
];

module.exports = { createGoalValidation, updateGoalValidation };
