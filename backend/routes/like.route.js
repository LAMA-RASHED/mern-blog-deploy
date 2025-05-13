const router = require('express').Router();
const ctrl = require('../controllers/like.controller');
const { protect } = require('../middlewares/permissions');

router.route('/:slug').post(protect, ctrl.postLike);

router.route('/:id').delete(protect, ctrl.remove);

router.get('/:postId/post', ctrl.getPostLikes);

module.exports = router;
