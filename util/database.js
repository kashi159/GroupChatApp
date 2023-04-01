const Sequelize = require('sequelize');
// require('dotenv').config();

const sequelize = new Sequelize('group-chat-app' , 'kashif15' , 'Kashif125' , {
    dialect: 'mysql',
    host: 'database-1.caa9caxcyybo.us-west-2.rds.amazonaws.com'
})

module.exports = sequelize;