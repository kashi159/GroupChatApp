const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
var cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));

const userRoutes = require('./router/user');
const chatRoutes = require('./router/chats');
const groupRoutes = require('./router/group');

const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/group');
const UserGroups = require('./models/groupUser');

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);
app.use((req, res) => {
    res.sendFile(path.join(__dirname, `Public/${req.url}`))
})


User.belongsToMany(Group, { through: UserGroups, foreignKey: 'userId' });
Group.belongsToMany(User, { through: UserGroups, foreignKey: 'groupId' });

Group.hasMany(Chat, { foreignKey: 'groupId' });
Chat.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Chat, { foreignKey: 'userId' });
Chat.belongsTo(User, { foreignKey: 'userId' });


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