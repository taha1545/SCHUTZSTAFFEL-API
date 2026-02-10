"use strict";

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "User",
        {
            fullName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            grade: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            googleId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            uniqueCode: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            xpPoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            currentStreak: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: "users",
            timestamps: true,
        }
    );
};
