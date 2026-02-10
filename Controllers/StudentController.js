"use strict";

const StudentDashboardService = require("../app/Services/StudentDashboardService");

const getDashboard = async (req, res) => {
  const data = await StudentDashboardService.getDashboard(req.user.id);
  res.status(200).json({
    success: true,
    data,
  });
};

module.exports = { getDashboard };
