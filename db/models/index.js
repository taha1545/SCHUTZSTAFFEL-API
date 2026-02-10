"use strict";

const Sequelize = require("sequelize");
const config = require(__dirname + "/../../config/config.js").development;

const sequelize = new Sequelize(config);
const db = {};

db.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.Teacher = require("./teacher.js")(sequelize, Sequelize.DataTypes);
db.Goal = require("./goal.js")(sequelize, Sequelize.DataTypes);
db.Task = require("./task.js")(sequelize, Sequelize.DataTypes);
db.UserTask = require("./usertask.js")(sequelize, Sequelize.DataTypes);
db.Badge = require("./badge.js")(sequelize, Sequelize.DataTypes);
db.UserBadge = require("./userbadge.js")(sequelize, Sequelize.DataTypes);
db.Contact = require("./contact.js")(sequelize, Sequelize.DataTypes);

// Associations
db.Teacher.hasMany(db.Goal, { foreignKey: "teacherId" });
db.Goal.belongsTo(db.Teacher, { foreignKey: "teacherId" });

db.Teacher.belongsToMany(db.User, {
  through: "teacher_students",
  foreignKey: "teacherId",
  otherKey: "userId",
});
db.User.belongsToMany(db.Teacher, {
  through: "teacher_students",
  foreignKey: "userId",
  otherKey: "teacherId",
});

db.Goal.hasMany(db.Task, { foreignKey: "goalId" });
db.Task.belongsTo(db.Goal, { foreignKey: "goalId" });

db.User.belongsToMany(db.Task, { through: db.UserTask, foreignKey: "userId", otherKey: "taskId" });
db.Task.belongsToMany(db.User, { through: db.UserTask, foreignKey: "taskId", otherKey: "userId" });

db.User.hasMany(db.UserTask, { foreignKey: "userId" });
db.Task.hasMany(db.UserTask, { foreignKey: "taskId" });
db.UserTask.belongsTo(db.User, { foreignKey: "userId" });
db.UserTask.belongsTo(db.Task, { foreignKey: "taskId" });

db.User.belongsToMany(db.Badge, { through: db.UserBadge, foreignKey: "userId", otherKey: "badgeId" });
db.Badge.belongsToMany(db.User, { through: db.UserBadge, foreignKey: "badgeId", otherKey: "userId" });

db.User.hasMany(db.UserBadge, { foreignKey: "userId" });
db.Badge.hasMany(db.UserBadge, { foreignKey: "badgeId" });
db.UserBadge.belongsTo(db.User, { foreignKey: "userId" });
db.UserBadge.belongsTo(db.Badge, { foreignKey: "badgeId" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
