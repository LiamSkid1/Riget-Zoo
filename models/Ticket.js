const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    ticketType: {type: String, required: true},
    price: {type: Number, required: true},
    visitDate: {type: Date, required: true}
});

module.exports = mongoose.model('Ticket', ticketSchema);