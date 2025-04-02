const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { validationResult } = require('express-validator');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSwagger();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(this.validationMiddleware);
  }

  setupRoutes() {
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/products', productRoutes);
  }

  setupSwagger() {
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  }

  validationMiddleware(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
