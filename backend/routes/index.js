const router = require('express').Router();

// route    /api/auth
router.use('/account', require('./auth.route'));
// route    /api/users
router.use('/users', require('./user.route'));
// route    /api/categories
router.use('/categories', require('./category.route'));
// route    /api/blogs
router.use('/blogs', require('./post.route'));
// route    /api/profile
router.use('/profile', require('./profile.route'));
// route    /api/comments
router.use('/comments', require('./comment.route'));
// route  /api/like
router.use('/like', require('./like.route'));
// route    /api/views
router.use('/views', require('./views.route'));
// route   /api/documents
router.use('/documents', require('./doc.route'));
module.exports = router;
