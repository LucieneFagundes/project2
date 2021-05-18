const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress', 'root', '1234teste', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;