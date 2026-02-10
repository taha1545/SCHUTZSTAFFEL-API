"use strict";

const { body } = require('express-validator');
const db = require('../../db/models');

const createUserBadgeValidation = [
  body('userId')
    .isInt().withMessage('userId must be an integer')
    .custom(async (userId) => {
      const user = await db.User.findByPk(userId);
      if (!user) throw new Error('userId does not exist');
    }),
  body('badgeId')
    .isInt().withMessage('badgeId must be an integer')
    .custom(async (badgeId) => {
      const badge = await db.Badge.findByPk(badgeId);
      if (!badge) throw new Error('badgeId does not exist');
    }),
];

module.exports = { createUserBadgeValidation };
