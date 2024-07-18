// backend/routes/infoRequestRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const InfoRequest = require('../models/InfoRequest');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Crear una nueva solicitud de información
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, date, cartItems } = req.body;

  const infoRequest = new InfoRequest({
    name,
    email,
    phone,
    date,
    cartItems
  });

  const createdInfoRequest = await infoRequest.save();
  res.status(201).json(createdInfoRequest);
}));

// Obtener todas las solicitudes de información (solo admin)
router.get('/', protect, asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const infoRequests = await InfoRequest.find().populate('cartItems.service', 'name price');
  res.json(infoRequests);
}));

module.exports = router;
