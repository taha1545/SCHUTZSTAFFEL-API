"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "UserBadge",
    {
      earnedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "user_badges",
      timestamps: true,
    }
  );
};
