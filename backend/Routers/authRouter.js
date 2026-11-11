const authControler = require('../Controlers/authControler');
const router = require('express').Router();

router.post('/login', authControler.loginUser);
router.post('/logout', authControler.logoutUser);
router.post('/forgot', authControler.forgotUserPassword);




module.exports = router;
