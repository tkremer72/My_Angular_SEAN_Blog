var express = require('express');
var router = express.Router();

const authControl = require('../controllers/auth.controller');

router.post('/signup', authControl.user_signup);
router.post('/login', authControl.user_login);
router.delete('/:id', authControl.delete_user);
module.exports = router;