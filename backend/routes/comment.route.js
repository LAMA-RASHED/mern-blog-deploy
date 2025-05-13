const router = require('express').Router()
const ctrl = require('../controllers/comments.controller');
const { protect, authorize, isAdminOrOwner } = require('../middlewares/permissions');
const query = require('../middlewares/query');
const Comment = require('../models/comment.model');


router.route('/')
.get(protect, authorize('admin',"super-admin","system"), query(Comment), ctrl.list)
.post(protect, ctrl.create)


router.route('/:id')
.get(ctrl.read)
.put(protect, isAdminOrOwner(Comment, 'userId'), ctrl.update)
.delete(protect, isAdminOrOwner(Comment, 'userId'), ctrl.delete)

router.get('/:postId/post', ctrl.getPostComments)
module.exports = router
