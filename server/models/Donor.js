// models/donor.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  donations: [donationSchema],
  loyaltyPoints: { type: Number, default: 0 }
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
