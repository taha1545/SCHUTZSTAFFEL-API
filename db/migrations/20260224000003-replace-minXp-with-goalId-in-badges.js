"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Remove old column
        await queryInterface.removeColumn("badges", "minXpRequired");

        // Add goalId FK
        await queryInterface.addColumn("badges", "goalId", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "goals", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("badges", "goalId");
        await queryInterface.addColumn("badges", "minXpRequired", {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },
};
