const Company = require("../Models/companyModel");
const prepareUser = require("./userControler").prepareUser;

module.exports = {
    createCompany: async (req, res) => {
        try { 
            
            const userData = await prepareUser(req);
            const companyData = new Company({
                ...userData,
                role: 'Recruiter',
                logo: req.body.logo, 
                activity: req.body.activity,
                
            });
           
            await companyData.save();
            res.status(201).json({message: 'Company created successfully ', data: companyData});
        } catch (error) {
            res.status(500).json({message: 'Error creating company ' + error.message});
        }
    },
    
    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.find().select('-password');
            if (companies.length === 0) {
                res.status(200).json({message: 'No companies found', data: null});
            }
            res.status(200).json({message: 'Companies retrieved successfully', data: companies});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving companies' + error.message});
        }

    },

    getCompanyById: async (req, res) => {
        try {
            const company = await Company.findById(req.params.id).select('-password');
            if (!company) {
                res.status(404).json({message: 'Company not found', data: null});
            }
            res.status(200).json({message: 'Company retrieved successfully', data: company});
        } catch (error) {
            res.status(500).json({message: 'Error retrieving company' + error.message});
        }
    },

    updateCompany: async (req, res) => {
        try { 
            const company = await Company.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if (!company) {
                res.status(404).json({message: 'Company not found', data: null});
            }
            res.status(201).json({message: 'Company updated successfully', data: company});
        } catch (error) {
            res.status(500).json({message: 'Error updating company' + error.message});
        }
    },

    deleteCompany: async (req, res) => {
        try {
            const company = await Company.findByIdAndDelete(req.params.id);   
            if (!company) {
                res.status(404).json({message: 'Company not found', data: null});
            }
            res.status(201).json({message: 'Company deleted successfully', data: company});
        } catch (error) {
            res.status(500).json({message: 'Error deleting company' + error.message});
        }
    }

}