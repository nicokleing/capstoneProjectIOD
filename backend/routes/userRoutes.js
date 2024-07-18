// routes/userRoutes.js
const express = require('express');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updatePassword,
} = require('../controllers/userController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(registerUser).get(protect, superAdmin, getUsers);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/profile/password')
  .put(protect, updatePassword); // Nueva ruta para actualizar la contraseña
router
  .route('/:id')
  .delete(protect, superAdmin, deleteUser)
  .get(protect, superAdmin, getUserById)
  .put(protect, superAdmin, updateUser);

module.exports = router;
