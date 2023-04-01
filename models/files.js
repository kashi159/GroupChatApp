const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const File = sequelize.define('filelinks', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileURL: Sequelize.STRING
})

module.exports = File;