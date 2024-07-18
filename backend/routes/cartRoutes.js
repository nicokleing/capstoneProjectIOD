// backend/routes/cartRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Service = require('../models/Service');
const router = express.Router();

// Agregar un servicio al carrito
// No se necesita en el backend ya que lo manejaremos en el frontend con localStorage

// Enviar solicitud de información
router.post('/request-info', asyncHandler(async (req, res) => {
  const { email, cartItems } = req.body;

  const cart = new Cart({
    email,
    cartItems,
  });

  const createdCart = await cart.save();

  // Aquí puedes enviar un correo electrónico con la información del carrito o cualquier otra lógica

  res.status(201).json(createdCart);
}));

module.exports = router;
