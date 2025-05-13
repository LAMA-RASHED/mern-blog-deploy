const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const { protect } = require('../middlewares/permissions');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/refresh', authCtrl.refresh);
router.all('/logout', authCtrl.logout);
router.put('/details', protect, authCtrl.updateDetails);
router.put('/password', protect, authCtrl.updatePassword);

module.exports = router;
