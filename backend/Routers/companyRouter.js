const companyControler = require("../Controlers/companyControler");
const router = require("express").Router();
const upload = require("../Middlewares/multer");

router.post("/", upload.single('logo'), companyControler.createCompany);
router.get("/", companyControler.getAllCompanies);
router.get("/:id", companyControler.getCompanyById);
router.put("/:id", upload.single('logo'), companyControler.updateCompany);
router.delete("/:id", companyControler.deleteCompany);


module.exports = router;



