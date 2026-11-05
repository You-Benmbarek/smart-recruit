const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    telephone: {type: String, required: true},
    role: {type: String, required: true, enum: ['Admin','Candidate', 'Recruiter']},
},{timestamps: true, discriminatorKey: 'role'}); 

const User = mongoose.model('User', userSchema);

module.exports = User;
