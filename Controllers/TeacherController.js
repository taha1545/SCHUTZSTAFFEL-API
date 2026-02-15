"use strict";

const TeacherResource = require('../app/Resource/TeacherResource');
const TeacherService = require('../app/Services/TeacherService');
const TeacherProgressService = require('../app/Services/TeacherProgressService');
const Auth = require('../app/Services/Auth');
const db = require('../db/models');

const createTeacher = async (req, res) => {
  const teacher = await TeacherService.createTeacher(req.body);
  res.status(201).json({
    success: true,
    message: 'Teacher created successfully',
    teacher: TeacherResource(teacher),
  });
};

const getTeacherById = async (req, res) => {
  const includeGoals = req.query.include === 'goals';
  const teacher = await TeacherService.getTeacherById(req.params.id, includeGoals);
  res.status(200).json({
    success: true,
    teacher: TeacherResource(teacher),
  });
};

const getAllTeachers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const includeGoals = req.query.include === 'goals';
  const isVerified =
    req.query.verified === undefined
      ? null
      : req.query.verified === 'true';
  const { count, rows } = await TeacherService.getAllTeachers(page, limit, includeGoals, isVerified);
  res.status(200).json({
    success: true,
    teachers: rows.map(teacher => TeacherResource(teacher)),
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

const updateTeacher = async (req, res) => {
  const teacher = await TeacherService.updateTeacher(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Teacher updated successfully',
    teacher: TeacherResource(teacher),
  });
};

const deleteTeacher = async (req, res) => {
  await TeacherService.deleteTeacher(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Teacher deleted successfully',
  });
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await TeacherService.loginTeacher(email, password);
  const token = Auth.CreateToken({
    id: teacher.id,
    role: 'teacher'
  });
  res.status(200).json({
    success: true,
    message: 'Teacher logged in successfully',
    teacher: TeacherResource(teacher),
    token
  });
};

const getMe = async (req, res) => {
  const teacher = await TeacherService.getTeacherById(req.user.id);
  res.status(200).json({
    success: true,
    teacher: TeacherResource(teacher),
  });
};

const getStudentProgress = async (req, res) => {
  const progress = await TeacherProgressService.getStudentProgress(req.user.id, req.params.userId);
  res.status(200).json({
    success: true,
    data: progress,
  });
};

const addStudent = async (req, res) => {
  const { userId } = req.body;
  await TeacherProgressService.addStudent(req.user.id, userId);
  res.status(201).json({
    success: true,
    message: 'Student linked to teacher successfully',
    userId,
  });
};

const getDashboard = async (req, res) => {
  const teacherId = req.user.id;
  // 
  const totalGoals = await db.Goal.count({ where: { teacherId } });
  //
  const totalStudents = await db.User.count({
    include: [
      {
        model: db.Teacher,
        where: { id: teacherId },
        through: { attributes: [] },
        required: true,
      }
    ],
    distinct: true,
  });
  // 
  const pendingCount = await db.UserTask.count({
    where: { status: { [db.Sequelize.Op.ne]: 'Completed' } },
    include: [
      {
        model: db.Task,
        required: true,
        include: [{ model: db.Goal, where: { teacherId }, required: true }],
      }
    ],
  });
  //
  const completedCount = await db.UserTask.count({
    where: { status: 'Completed' },
    include: [
      {
        model: db.Task,
        required: true,
        include: [{ model: db.Goal, where: { teacherId }, required: true }],
      }
    ],
  });
  //
  res.status(200).json({
    success: true,
    data: {
      totalGoals,
      totalStudents,
      totalTasksPending: pendingCount,
      totalTasksCompleted: completedCount,
    },
  });
};

module.exports = {
  createTeacher,
  getTeacherById,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  loginTeacher,
  getStudentProgress,
  addStudent,
  getMe,
  getDashboard,
};
