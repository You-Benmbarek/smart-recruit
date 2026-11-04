const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    telephone: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    role: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

