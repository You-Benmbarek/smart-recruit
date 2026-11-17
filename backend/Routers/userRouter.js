const userControler = require('../Controlers/userControler');
const router = require('express').Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require('../Middlewares/roleMiddleware');

router.post('/', userControler.createUser);
router.get('/', authMiddleware, checkRole(["Admin", "Recruiter"]), userControler.getAllUsers); //ordre avec next()
router.get('/:id', userControler.getUserById);
router.put('/:id', userControler.updateUser);
router.delete('/:id', userControler.deleteUser);

module.exports = router;

