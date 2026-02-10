"use strict";

const UserBadgeResource = require('../app/Resource/UserBadgeResource');
const UserBadgeService = require('../app/Services/UserBadgeService');

const createUserBadge = async (req, res) => {
  const userBadge = await UserBadgeService.createUserBadge(req.body);
  res.status(201).json({
    success: true,
    message: 'UserBadge created successfully',
    userBadge: UserBadgeResource(userBadge),
  });
};

const getUserBadgeById = async (req, res) => {
  const includeRelations = req.query.include === 'relations';
  const userBadge = await UserBadgeService.getUserBadgeById(req.params.id, includeRelations);
  res.status(200).json({
    success: true,
    userBadge: UserBadgeResource(userBadge),
  });
};

const getAllUserBadges = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const includeRelations = req.query.include === 'relations';
  const { count, rows } = await UserBadgeService.getAllUserBadges(page, limit, includeRelations);
  res.status(200).json({
    success: true,
    userBadges: rows.map(userBadge => UserBadgeResource(userBadge)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const getUserBadgesByUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await UserBadgeService.getUserBadgesByUser(req.params.userId, page, limit);
  res.status(200).json({
    success: true,
    userBadges: rows.map(userBadge => UserBadgeResource(userBadge)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const getUserBadgesByBadge = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await UserBadgeService.getUserBadgesByBadge(req.params.badgeId, page, limit);
  res.status(200).json({
    success: true,
    userBadges: rows.map(userBadge => UserBadgeResource(userBadge)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const deleteUserBadge = async (req, res) => {
  await UserBadgeService.deleteUserBadge(req.params.id);
  res.status(200).json({
    success: true,
    message: 'UserBadge deleted successfully',
  });
};

module.exports = {
  createUserBadge,
  getUserBadgeById,
  getAllUserBadges,
  getUserBadgesByUser,
  getUserBadgesByBadge,
  deleteUserBadge,
};
