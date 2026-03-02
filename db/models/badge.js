"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Badge",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      iconPath: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "badges",
      timestamps: true,
    }
  );
};
