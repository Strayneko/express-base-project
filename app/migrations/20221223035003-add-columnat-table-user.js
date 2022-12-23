"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return await queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.addColumn(
          "Users",
          "username",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction }
        )
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.removeColumn("Users", "username", { transaction })
      ]);
    });
  }
};
