"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("users", "lastActivityDate", {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("users", "lastActivityDate");
    },
};
