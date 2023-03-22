const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

router.post('/signup', userController.postSignUpUser);
router.post('/login', userController.postLoginUser)

module.exports = router;