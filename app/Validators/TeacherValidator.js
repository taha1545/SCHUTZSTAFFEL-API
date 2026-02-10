"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const createTeacherValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .custom(async (email) => {
      const existing = await db.Teacher.findOne({ where: { email } });
      if (existing) throw new Error('Email is already in use');
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const updateTeacherValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .custom(async (email, { req }) => {
      const existing = await db.Teacher.findOne({ where: { email } });
      if (existing && existing.id !== req.params.id) throw new Error('Email is already in use');
    }),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginTeacherValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .custom(async (email) => {
      const teacher = await db.Teacher.findOne({ where: { email } });
      if (!teacher) throw new Error('Teacher not found with this email');
    }),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { createTeacherValidation, updateTeacherValidation, loginTeacherValidation };
