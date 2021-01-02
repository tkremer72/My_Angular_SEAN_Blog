var express = require('express');
var router = express.Router();

var adminControl = require('../controllers/admin.controller');

router.get('/users', adminControl.get_users);
router.delete('/:id', adminControl.delete_user);

module.exports = router;