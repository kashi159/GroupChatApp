const User = require('../models/user');
const Chat = require('../models/chats')
const sequelize = require('../util/database');

exports.getUsers = async (req, res, next) => {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error getting users' });
    }
  }

  exports.postChat = async (req, res, next) => {
    const msg = req.body.message;
    console.log(msg);
    let transact;
    try {
      transact = await sequelize.transaction();
      const response = await Chat.create({
        message: msg,
        userId: req.user.id
      }, { transaction: transact });
      await transact.commit();
      const id = response.userId;
      const user = await User.findByPk(id);
      const name = user.name;
      const message = response.message
      res.status(200).json({ message, name });
    } catch (err) {
      console.log(err);
      // Send an error response
      return res.status(500).json({ error: 'Error posting chat' });
    }
  }

// exports.getChat = async (req, res, next)=> {
//     try{
//         const response =await Chat.findAll();
//         res.status(200).json(response);
//     }catch(err){
//         console.log(err)
//     }
// }

exports.getChat = async (req, res, next) => {
    try {
      const results = await sequelize.query(
        `SELECT userchats.message, users.name
         FROM userchats
         JOIN users ON userchats.userId = users.id`
      );
    //   console.log(JSON.stringify(results[0], null, 2));
      return res.json(results[0]);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error getting chat' });
    }
  }