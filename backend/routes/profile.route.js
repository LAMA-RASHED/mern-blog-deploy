const router = require('express').Router()
const ctrl = require('../controllers/profile.controller');
const { protect, isAdminOrOwner } = require('../middlewares/permissions');
const upload = require('../middlewares/upload');
const Profile = require('../models/profile.model');

router.use(protect)   //req.user => role, name, email, pasword

router.route('/')
.post( upload.single('image'), ctrl.create)



router.route('/:id')
.get(isAdminOrOwner(Profile, 'userId'), ctrl.read)
.put(isAdminOrOwner(Profile, 'userId'), upload.single('image'), ctrl.update)
.delete(isAdminOrOwner(Profile, 'userId'), ctrl.delete)

module.exports = router
