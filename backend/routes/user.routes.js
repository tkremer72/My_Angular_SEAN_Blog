var express = require('express');

var router = express.Router();
const upload = require('../middleware/upload');
const userControl = require('../controllers/user.controller');

router.get('/', userControl.get_users);
router.get('/profile', userControl.get_profile);
router.get('/:id', userControl.get_user);
router.put('/:id', upload, userControl.update_user);

module.exports = router;
