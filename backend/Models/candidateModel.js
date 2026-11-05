const mongoose = require("mongoose");
const userModel = require("../Models/userModel");


const candidateSchema = new mongoose.Schema({
    photo: {type: String, required: true},
    diplom: {type: String, required: true},
    speciality: {type: String, required: true},


});

const Candidate = userModel.discriminator('Candidate', candidateSchema);
module.exports = Candidate;



