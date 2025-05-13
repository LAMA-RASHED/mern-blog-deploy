const router = require('express').Router()
const ctrl = require('../controllers/view.controller');
const { protect, authorize } = require('../middlewares/permissions');


router.route('/')
.get(protect, authorize('admin'), ctrl.getUserViews)


module.exports = router
