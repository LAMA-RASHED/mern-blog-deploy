const router = require('express').Router();
const ctrl = require('../controllers/users.controller');
const {
  protect,
  authorize,
  isAdminOrOwner,
} = require('../middlewares/permissions');
const query = require('../middlewares/query');
const User = require('../models/user.model');

router.use(protect); //req.user => role, name, email, pasword
// router.use(authorize('admin'));

router
  // .use(authorize('admin'))
  .route('/')
  .get(authorize('admin'), query(User), ctrl.list)
  .post(authorize('admin'), ctrl.create);

router
  .route('/:id')
  .get(isAdminOrOwner(User, '_id'), ctrl.read)
  .put(isAdminOrOwner(User, '_id'), ctrl.update)
  .delete(isAdminOrOwner(User, '_id'), ctrl.delete);

module.exports = router;
