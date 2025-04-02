const productService = require('../services/productService');
const { validationResult } = require('express-validator');

class ProductController {
  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, price } = req.body;
      const productId = await productService.createProduct(name, description, price);
      res.status(201).json({ message: 'Product created successfully', productId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updatedFields = req.body;
      const updatedProduct = await productService.updateProduct(id, updatedFields);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const deletedProduct = await productService.deleteProduct(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { search, minPrice, maxPrice, sort } = req.query;
      const products = await productService.getAllProducts({ search, minPrice, maxPrice, sort });
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async bulkInsertProducts(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const insertedCount = await productService.bulkInsertProductsFromExcel(req.file);
      res.json({ message: `${insertedCount} products inserted successfully` });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
