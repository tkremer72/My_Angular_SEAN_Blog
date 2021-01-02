var express = require('express');
const { check } = require('express-validator');
var router = express.Router();

const authControl = require('../controllers/auth.controller');

router.post('/signup', 
check('user_email')
.not()
.isEmpty()
.isEmail(),
check('user_password')
.not()
.isEmpty()
.isLength({ min: 6 }),
authControl.user_signup);

router.post('/login', authControl.user_login);

//router.delete('/:id', authControl.delete_user);
module.exports = router;