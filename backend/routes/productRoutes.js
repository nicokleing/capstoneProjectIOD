// backend/routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage });

// Obtener todos los productos
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Crear un nuevo producto (Solo admin)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    image: req.file.path,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

module.exports = router;
