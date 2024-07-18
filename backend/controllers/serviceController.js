const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, video } = req.body;

  const service = new Service({
    name,
    description,
    price,
    category,
    image,
    video,
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
});

// @desc    Search services
// @route   GET /api/services/search/:keyword
// @access  Public
const searchServices = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getServices,
  getServiceById,
  createService,
  searchServices,
};


