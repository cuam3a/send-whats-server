module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        WAChannel: {
            type: Sequelize.STRING
        },
        WABrowserId: {
            type: Sequelize.STRING
        },
        WASecretBundle: {
            type: Sequelize.STRING
        },
        WAToken1: {
            type: Sequelize.STRING
        },
        WAToken2: {
            type: Sequelize.STRING
        }
    });

    return Users;
};