const candidateControler = require('../Controlers/candidateControler');
const router = require('express').Router();
const upload = require('../Middlewares/multer');



router.post('/', upload.single('photo'), candidateControler.createCandidate);
router.get('/', candidateControler.getAllCandidates);
router.get('/:id', candidateControler.getCandidateById);
router.put('/:id', upload.single('photo'), candidateControler.updateCandidate);
router.delete('/:id', candidateControler.deleteCandidate);


module.exports = router;


