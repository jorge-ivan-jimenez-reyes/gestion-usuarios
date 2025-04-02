const xlsx = require('xlsx');
const productModel = require('../models/productModel');

class ProductService {
  async createProduct(name, description, price) {
    return await productModel.createProduct(name, description, price);
  }

  async getProductById(id) {
    return await productModel.getProductById(id);
  }

  async updateProduct(id, updatedFields) {
    return await productModel.updateProduct(id, updatedFields);
  }

  async deleteProduct(id) {
    return await productModel.deleteProduct(id);
  }

  async getAllProducts() {
    return await productModel.getAllProducts();
  }

  async bulkInsertProductsFromExcel(file) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);

    // Validate products
    const validatedProducts = products.map(product => {
      if (!product.name || !product.description || !product.price) {
        throw new Error('Invalid product data: name, description, and price are required');
      }
      return {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price)
      };
    });

    await productModel.bulkInsertProducts(validatedProducts);
    return validatedProducts.length;
  }
}

module.exports = new ProductService();
