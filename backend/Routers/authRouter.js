const authControler = require('../Controlers/authControler');
const router = require('express').Router();

router.post('/login', authControler.loginUser);
router.post('/logout', authControler.logoutUser);
router.post('/forgot', authControler.forgotUserPassword);
router.post('/reset', authControler.resetPassword);
router.post('/reset-password/:token', authControler.resetPassword);

module.exports = router;
