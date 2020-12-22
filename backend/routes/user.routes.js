var express = require('express');
var router = express.Router();

const userControl = require('../controllers/user.controller');

router.get('/', userControl.get_users);
router.get('/profile/:id', userControl.get_profile);
router.put('/:id', userControl.update_user);

module.exports = router;
