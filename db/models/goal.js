"use strict";

const DOMAIN_LIST = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'Cybersecurity',
  'Networking',
  'Cloud Computing',
  'Artificial Intelligence',
  'Data Science',
  'Mobile Development',
  'Game Development',
  'Blockchain',
  'Embedded Systems',
  'UI/UX Design',
  'Database Engineering',
  'Software Architecture',
  'Testing & QA',
  'System Administration',
  'Tech Stack'
];

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Goal",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      domain: {
        type: DataTypes.ENUM(...DOMAIN_LIST),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("In-Progress", "Completed"),
        allowNull: false,
        defaultValue: "In-Progress",
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "teachers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "goals",
      timestamps: true,
    }
  );
};
