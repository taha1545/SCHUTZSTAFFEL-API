"use strict";

const db = require('../../db/models');
const bcrypt = require('bcrypt');
const NotFoundError = require('../Error/NotFoundError');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const createTeacher = async (data) => {
  const hashedPassword = await hashPassword(data.password);
  return await db.Teacher.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });
};

const getTeacherById = async (id, includeGoals = false) => {
  const options = { where: { id } };
  if (includeGoals) {
    options.include = [{ model: db.Goal }];
  }
  const teacher = await db.Teacher.findOne(options);
  if (!teacher) throw new NotFoundError('Teacher not found');
  return teacher;
};

const getAllTeachers = async (
  page = 1,
  limit = 15,
  includeGoals = false,
  isVerified = null
) => {
  const offset = (page - 1) * limit;
  const options = {
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    where: {},
  };
  if (includeGoals) {
    options.include = [{ model: db.Goal }];
  }
  if (isVerified !== null) {
    options.where.isVerified = isVerified;
  }
  return db.Teacher.findAndCountAll(options);
};


const updateTeacher = async (id, data) => {
  const teacher = await getTeacherById(id);
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  await teacher.update(data);
  return teacher;
};

const deleteTeacher = async (id) => {
  const teacher = await getTeacherById(id);
  await teacher.destroy();
  return teacher;
};

const loginTeacher = async (email, password) => {
  const teacher = await db.Teacher.findOne({ where: { email } });
  if (!teacher) {
    throw new NotFoundError('Teacher not found with this email');
  }
  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) {
    const AuthError = require('../Error/AuthError');
    throw new AuthError('Invalid password');
  }
  return teacher;
};

const resetPasswordByEmail = async (email, newPassword) => {
  const teacher = await db.Teacher.findOne({ where: { email } });
  if (!teacher) throw new NotFoundError('Teacher not found with this email');
  const hashed = await hashPassword(newPassword);
  await teacher.update({ password: hashed });
  return teacher;
};

module.exports = {
  createTeacher,
  getTeacherById,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  loginTeacher,
  resetPasswordByEmail,
};
