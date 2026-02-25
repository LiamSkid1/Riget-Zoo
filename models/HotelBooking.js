const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    roomType: {type: String, required: true},
    totalPrice: {type: Number, required: true},
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true}
});

module.exports = mongoose.model('HotelBooking', hotelSchema);