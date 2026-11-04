const mongosse = require("mongoose");

const candidateSchema = new mongosse.Schema({
    photo: {type: String, required: true},
    diplome: {type: String, required: true},
    specialite: {type: String, required: true},

});

const Candidate = mongosse.model('Candidate', candidateSchema);

