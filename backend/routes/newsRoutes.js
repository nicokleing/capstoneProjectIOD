const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  crearNoticia,
  obtenerNoticias,
  obtenerNoticiaPorId,
  darMeGusta,
  valorarNoticia,
  actualizarNoticia,
  eliminarNoticia
} = require('../controllers/newsController');

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.route('/')
  .get(obtenerNoticias)
  .post(protect, admin, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 10 }]), crearNoticia);

router.route('/:id')
  .get(obtenerNoticiaPorId)
  .put(protect, admin, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 10 }]), actualizarNoticia)
  .delete(protect, admin, eliminarNoticia);

router.route('/:id/like').post(darMeGusta);
router.route('/:id/rate').post(valorarNoticia);

module.exports = router;
