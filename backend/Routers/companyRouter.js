const companyControler = require("../Controlers/companyControler");
const router = require("express").Router();

router.post("/", companyControler.createCompany);
router.get("/", companyControler.getAllCompanies);
router.get("/:id", companyControler.getCompanyById);
router.put("/:id", companyControler.updateCompany);
router.delete("/:id", companyControler.deleteCompany);


module.exports = router;

