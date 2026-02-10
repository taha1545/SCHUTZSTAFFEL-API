"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Task",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      taskKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isUsedKey: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      goalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "goals", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "tasks",
      timestamps: true,
    }
  );
};
