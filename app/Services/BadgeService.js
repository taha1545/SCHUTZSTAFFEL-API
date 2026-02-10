"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');

const createBadge = async (data) => {
  return await db.Badge.create({
    name: data.name,
    description: data.description,
    iconPath: data.iconPath,
    minXpRequired: data.minXpRequired,
  });
};

const getBadgeById = async (id) => {
  const badge = await db.Badge.findByPk(id);
  if (!badge) throw new NotFoundError('Badge not found');
  return badge;
};

const getAllBadges = async (page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.Badge.findAndCountAll({
    limit,
    offset,
    order: [['minXpRequired', 'ASC']],
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
  getAllBadges,
  updateBadge,
  deleteBadge,
};
