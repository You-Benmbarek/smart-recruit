const userControler = require('../Controlers/userControler');
const router = require('express').Router();

router.post('/adduser', userControler.createUser);
router.get('/allusers', userControler.getAllUsers);
router.get('/getuserbyid/:id', userControler.getUserById);
router.put('/updateuser/:id', userControler.updateUser);
router.delete('/deleteuser/:id', userControler.deleteUser);

module.exports = router;

