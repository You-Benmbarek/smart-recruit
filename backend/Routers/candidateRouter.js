const candidateControler = require('../Controlers/candidateControler');
const router = require('express').Router();


router.post('/', candidateControler.createCandidate);
router.get('/', candidateControler.getAllCandidates);
router.get('/:id', candidateControler.getCandidateById);
router.put('/:id', candidateControler.updateCandidate);
router.delete('/:id', candidateControler.deleteCandidate);



module.exports = router;


