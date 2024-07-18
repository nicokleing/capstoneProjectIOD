const express = require('express');
const multer = require('multer');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const path = require('path'); // Importar path para manejar rutas de archivos
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ruta para obtener todos los servicios o filtrar por categoría y subcategoría
router.get('/', asyncHandler(async (req, res) => {
  const { category, subcategory } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (subcategory) {
    filter.subcategory = subcategory;
  }
  const services = await Service.find(filter).populate('user', 'name email');
  res.json(services);
}));

// Ruta para obtener un servicio por ID
router.get('/:id', asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('user', 'name email');
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
}));

// Ruta para crear un nuevo servicio
router.post('/', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), asyncHandler(async (req, res) => {
  const { name, price, description, category, subcategory, url } = req.body;
  const serviceData = {
    name,
    price,
    description,
    category,
    subcategory,
    url,
    user: req.user._id  // Asocia el servicio con el usuario autenticado
  };

  if (req.files['image']) {
    serviceData.image = req.files['image'][0].path;
  }

  if (req.files['video']) {
    serviceData.video = req.files['video'][0].path;
  }

  const service = new Service(serviceData);

  const createdService = await service.save();
  res.status(201).json(createdService);
}));

// Ruta para actualizar un servicio por ID
router.put('/:id', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    service.name = req.body.name || service.name;
    service.price = req.body.price || service.price;
    service.description = req.body.description || service.description;
    service.category = req.body.category || service.category;
    service.subcategory = req.body.subcategory || service.subcategory;
    service.url = req.body.url || service.url;

    if (req.files['image']) {
      service.image = req.files['image'][0].path;
    }
    if (req.files['video']) {
      service.video = req.files['video'][0].path;
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
}));

// Ruta para eliminar un servicio por ID
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    await service.remove();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
}));

// Ruta de búsqueda
router.get('/search/:keyword', asyncHandler(async (req, res) => {
  const keyword = req.params.keyword
    ? {
        name: {
          $regex: req.params.keyword,
          $options: 'i',
        },
      }
    : {};

  const services = await Service.find({ ...keyword });
  res.json(services);
}));

// Sirve los archivos estáticos de la carpeta "uploads"
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
