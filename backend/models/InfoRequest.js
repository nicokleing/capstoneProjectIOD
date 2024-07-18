// backend/models/InfoRequest.js
const mongoose = require('mongoose');

const infoRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  cartItems: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
      },
      qty: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const InfoRequest = mongoose.model('InfoRequest', infoRequestSchema);

module.exports = InfoRequest;
