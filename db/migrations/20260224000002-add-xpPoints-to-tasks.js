"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("tasks", "xpPoints", {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 10,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("tasks", "xpPoints");
    },
};
