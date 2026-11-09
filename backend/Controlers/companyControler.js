const Company = require("../Models/companyModel");
const prepareUser = require("./userControler").prepareUser;
const fs = require('fs');
const path = require('path');
const {sendWelcomeEmail} = require("../utils/sendEmail");

module.exports = {
    createCompany: async (req, res) => {
        try { 
            
            const userData = await prepareUser(req);
            const companyData = new Company({
                ...userData,
                role: 'Recruiter',
                logo: req.file ? req.file.path : null, 
                activity: req.body.activity,
                
            });
           
            await companyData.save();
            //send welcome email to the new company
            await sendWelcomeEmail(companyData.email, companyData.fullName);
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
            const company = await Company.findById(req.params.id);
            if (!company) {
                if (req.file) fs.unlink(req.file.path, ()=> {}); // Delete the uploaded file if company not found
                res.status(404).json({message: 'Company not found', data: null});
            }
            const updatedData = {
                ...req.body,
                logo: req.file ? req.file.path : company.logo,
            };
            if (req.file) {
                // Delete the old logo file if it exists
                if (company.logo) {
                    const oldLogoPath = company.logo;
                    fs.unlink(oldLogoPath, (err) => {
                        if (err) {
                            console.error('Error deleting old logo:', err);
                        }
                    });
                }
                updatedData.logo = req.file.path;
            }
            const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updatedData, {new: true});
            res.status(201).json({message: 'Company updated successfully', data: updatedCompany});
        } catch (error) {
            if (req.file) fs.unlink(req.file.path, ()=> {}); // Delete the uploaded file if there's an error
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