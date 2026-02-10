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
      minXpRequired: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "badges",
      timestamps: true,
    }
  );
};
