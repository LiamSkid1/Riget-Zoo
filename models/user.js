const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}, 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date},  // optional
    loyaltyPoints: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now}  // Tracks when account was created
});

module.exports = mongoose.model('User', userSchema);