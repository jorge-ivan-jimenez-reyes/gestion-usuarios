const express = require('express');
const { body, param, query } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Create a new service
router.post('/', [
  body('name').notEmpty().withMessage('Service name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('category').notEmpty().withMessage('Category is required')
], serviceController.createService);

// Get all services
router.get('/', [
  query('name').optional().isString(),
  query('category').optional().isString(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('sort').optional().isString(),
  query('order').optional().isIn(['ASC', 'DESC'])
], serviceController.getAllServices);

// Get a single service by ID
router.get('/:id', param('id').isInt().withMessage('Invalid service ID'), serviceController.getServiceById);

// Update a service
router.put('/:id', [
  param('id').isInt().withMessage('Invalid service ID'),
  body('name').optional().notEmpty().withMessage('Service name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
], serviceController.updateService);

// Delete a service
router.delete('/:id', param('id').isInt().withMessage('Invalid service ID'), serviceController.deleteService);

module.exports = router;
