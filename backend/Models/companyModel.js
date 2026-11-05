const mongoose = require('mongoose');
const userModel = require("../Models/userModel");

const companySchema = new mongoose.Schema({
    logo: {type: String, required: true},
    activity: {type: String, required: true},
});

const Company = userModel.discriminator('Recruiter', companySchema);
module.exports = Company;