const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/permissions');
const query = require('../middlewares/query');
const Category = require('../models/category.model');

// GET route should be public, no auth required
router.route('/').get(ctrl.list);

// Other routes require auth
router.use(protect); //req.user => role, name, email, pasword
router.use(authorize('admin'));

router.route('/').post(ctrl.create);

router.route('/:id').get(ctrl.read).put(ctrl.update).delete(ctrl.delete);

module.exports = router;
