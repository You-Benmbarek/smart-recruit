const userControler = require('../Controlers/userControler');
const router = require('express').Router();

router.post('/', userControler.createUser);
router.get('/', userControler.getAllUsers);
router.get('/:id', userControler.getUserById);
router.put('/:id', userControler.updateUser);
router.delete('/:id', userControler.deleteUser);

module.exports = router;

