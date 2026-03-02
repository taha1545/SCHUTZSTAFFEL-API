"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');

const createBadge = async (data) => {
  return await db.Badge.create({
    name: data.name,
    description: data.description,
    iconPath: data.iconPath,
    goalId: data.goalId || null,
  });
};

const getBadgeById = async (id) => {
  const badge = await db.Badge.findByPk(id);
  if (!badge) throw new NotFoundError('Badge not found');
  return badge;
};

const getBadgeByGoalId = async (goalId) => {
  return await db.Badge.findOne({ where: { goalId } });
};

const getAllBadges = async (page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.Badge.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'ASC']],
  });
};

const updateBadge = async (id, data) => {
  const badge = await getBadgeById(id);
  await badge.update(data);
  return badge;
};

const deleteBadge = async (id) => {
  const badge = await getBadgeById(id);
  await badge.destroy();
  return badge;
};

module.exports = {
  createBadge,
  getBadgeById,
  getBadgeByGoalId,
  getAllBadges,
  updateBadge,
  deleteBadge,
};
