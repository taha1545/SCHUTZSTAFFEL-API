"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const VALID_DOMAINS = [
 'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'Cybersecurity',
  'Networking',
  'Cloud Computing',
  'Artificial Intelligence',
  'Data Science',
  'Mobile Development',
  'Game Development',
  'Blockchain',
  'Embedded Systems',
  'UI/UX Design',
  'Database Engineering',
  'Software Architecture',
  'Testing & QA',
  'System Administration',
  'Tech Stack'
];

const createGoalValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('domain')
    .optional()
    .isIn(VALID_DOMAINS)
    .withMessage(`Domain must be one of: ${VALID_DOMAINS.join(', ')}`),
  body('status')
    .optional()
    .isIn(['In-Progress', 'Completed'])
    .withMessage('Status must be In-Progress or Completed'),
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
  body('domain')
    .optional()
    .isIn(VALID_DOMAINS)
    .withMessage(`Domain must be one of: ${VALID_DOMAINS.join(', ')}`),
  body('status')
    .optional()
    .isIn(['In-Progress', 'Completed'])
    .withMessage('Status must be In-Progress or Completed'),
  body('teacherId')
    .optional()
    .isInt().withMessage('teacherId must be an integer')
    .custom(async (teacherId) => {
      const teacher = await db.Teacher.findByPk(teacherId);
      if (!teacher) throw new Error('teacherId does not exist');
    }),
];

module.exports = { createGoalValidation, updateGoalValidation };
