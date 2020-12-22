var express = require('express');
var router = express.Router();

const blogControl = require('../controllers/blog.controller');

router.get('/:id', blogControl.get_blog);

router.get('/all/blogs', blogControl.get_all_blogs);

router.get('/user/blogs', blogControl.get_users_blogs);

router.post('/create', blogControl.create_blog);

router.put('/:id', blogControl.update_blog);

router.delete('/:id', blogControl.delete_blog);



module.exports = router;
