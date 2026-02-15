"use strict";

const Grades = require('../app/Services/GradeServices');

const getAllGrades = async (req, res) => {
  const grades = Array.isArray(Grades) ? Grades : [];
  res.status(200).json({
    success: true,
    grades,
  });
};

module.exports = {
  getAllGrades,
};
