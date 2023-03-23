const express = require('express');
const router = express.Router();

const userAuthenticate = require('../middleware/auth')
const chatController = require('../controller/chat')

router.get('/users', userAuthenticate.authenticate , chatController.getUsers);
router.get('/chats', userAuthenticate.authenticate, chatController.getChat);
router.post('/chats', userAuthenticate.authenticate, chatController.postChat);
router.get('/newchats', userAuthenticate.authenticate, chatController.getNewChat)

module.exports = router;