const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    budget: { type: Number, required: true },
    donation: { type: Number, required: true },
    sector: { type: String, required: true }
});

module.exports = mongoose.model('Donation', DonationSchema);
