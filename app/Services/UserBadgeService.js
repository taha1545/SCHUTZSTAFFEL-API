"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');

const createUserBadge = async (data) => {
  const existing = await db.UserBadge.findOne({
    where: {
      userId: data.userId,
      badgeId: data.badgeId,
    },
  });
  if (existing) {
    throw new Error('User already has this badge');
  }
  return await db.UserBadge.create({
    userId: data.userId,
    badgeId: data.badgeId,
    earnedAt: data.earnedAt || new Date(),
  });
};

const getUserBadgeById = async (id, includeRelations = false) => {
  const options = { where: { id } };
  if (includeRelations) {
    options.include = [
      { model: db.User },
      { model: db.Badge },
    ];
  }
  const userBadge = await db.UserBadge.findOne(options);
  if (!userBadge) throw new NotFoundError('UserBadge not found');
  return userBadge;
};

const getAllUserBadges = async (page = 1, limit = 15, includeRelations = false) => {
  const offset = (page - 1) * limit;
  const options = {
    limit,
    offset,
    order: [['earnedAt', 'DESC']],
  };
  if (includeRelations) {
    options.include = [
      { model: db.User },
      { model: db.Badge },
    ];
  }
  return await db.UserBadge.findAndCountAll(options);
};

const getUserBadgesByUser = async (userId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserBadge.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['earnedAt', 'DESC']],
    include: [{ model: db.Badge }],
  });
};

const getUserBadgesByBadge = async (badgeId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserBadge.findAndCountAll({
    where: { badgeId },
    limit,
    offset,
    order: [['earnedAt', 'DESC']],
    include: [{ model: db.User }],
  });
};

const deleteUserBadge = async (id) => {
  const userBadge = await getUserBadgeById(id);
  await userBadge.destroy();
  return userBadge;
};

module.exports = {
  createUserBadge,
  getUserBadgeById,
  getAllUserBadges,
  getUserBadgesByUser,
  getUserBadgesByBadge,
  deleteUserBadge,
};
