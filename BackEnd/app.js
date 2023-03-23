const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
var cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));

const userRoutes = require('./router/user');
const chatRoutes = require('./router/chats')

const User = require('./models/user');
const Chat = require('./models/chats')

app.use('/user', userRoutes);
app.use('/chat', chatRoutes)


User.hasMany(Chat);
Chat.belongsTo(User)


sequelize
// .sync({force: true})
.sync()
.then(result =>{
    // console.log(result);
    app.listen(process.env.PORT || 3000);
})
.catch(err =>{
    console.log(err);
});

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
 authenticate();