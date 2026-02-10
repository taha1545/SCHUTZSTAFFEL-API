"use strict";

const BadgeResource = require('../app/Resource/BadgeResource');
const BadgeService = require('../app/Services/BadgeService');

const createBadge = async (req, res) => {
  const iconPath = req.file ? req.file.path : null;
  const badge = await BadgeService.createBadge({ ...req.body, iconPath });
  res.status(201).json({
    success: true,
    message: 'Badge created successfully',
    badge: BadgeResource(badge),
  });
};

const getBadgeById = async (req, res) => {
  const badge = await BadgeService.getBadgeById(req.params.id);
  res.status(200).json({
    success: true,
    badge: BadgeResource(badge),
  });
};

const getAllBadges = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const { count, rows } = await BadgeService.getAllBadges(page, limit);
  res.status(200).json({
    success: true,
    badges: rows.map(badge => BadgeResource(badge)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const updateBadge = async (req, res) => {
  const badge = await BadgeService.updateBadge(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Badge updated successfully',
    badge: BadgeResource(badge),
  });
};

const deleteBadge = async (req, res) => {
  await BadgeService.deleteBadge(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Badge deleted successfully',
  });
};

module.exports = {
  createBadge,
  getBadgeById,
  getAllBadges,
  updateBadge,
  deleteBadge,
};
