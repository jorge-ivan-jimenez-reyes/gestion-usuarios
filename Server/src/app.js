const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/products', productRoutes);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
