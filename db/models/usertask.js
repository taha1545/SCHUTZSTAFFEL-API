"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "UserTask",
    {
      status: {
        type: DataTypes.ENUM("Pending", "In-Progress", "Completed"),
        allowNull: false,
        defaultValue: "Pending",
      },
      keySubmitted: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "user_tasks",
      timestamps: true,
    }
  );
};
