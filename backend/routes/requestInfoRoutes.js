// backend/routes/requestInfoRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { cartItems, contactInfo } = req.body;

  // Aquí puedes manejar la solicitud como prefieras, por ejemplo, enviando un correo electrónico
  console.log('Cart Items:', cartItems);
  console.log('Contact Info:', contactInfo);

  res.status(201).json({ message: 'Request submitted successfully' });
}));

module.exports = router;
