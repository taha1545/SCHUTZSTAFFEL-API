"use strict";

const { body } = require('express-validator');

const createBadgeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('iconPath').optional().isString().withMessage('iconPath must be a string'),
  body('minXpRequired')
    .isInt({ min: 0 }).withMessage('minXpRequired must be a non-negative integer'),
];

const updateBadgeValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional(),
  body('iconPath').optional().isString().withMessage('iconPath must be a string'),
  body('minXpRequired')
    .optional()
    .isInt({ min: 0 }).withMessage('minXpRequired must be a non-negative integer'),
];

module.exports = { createBadgeValidation, updateBadgeValidation };
