const express = require('express');
const router = express.Router();

const userAuthenticate = require('../middleware/auth')
const groupController = require('../controller/group')

router.get('/usergroup', userAuthenticate.authenticate, groupController.getGroup)
router.post('/newgroup', userAuthenticate.authenticate , groupController.postGroup);

module.exports = router;