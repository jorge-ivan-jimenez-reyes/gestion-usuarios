const { getPool } = require('../config/database');

class ProductModel {
  async createProduct(name, description, price) {
    const query = 'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING id';
    const values = [name, description, price];
    const result = await getPool().query(query, values);
    return result.rows[0].id;
  }

  async getProductById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await getPool().query(query, [id]);
    return result.rows[0];
  }

  async updateProduct(id, updatedFields) {
    const setClause = Object.keys(updatedFields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const query = `UPDATE products SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [id, ...Object.values(updatedFields)];
    const result = await getPool().query(query, values);
    return result.rows[0];
  }

  async deleteProduct(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await getPool().query(query, [id]);
    return result.rows[0];
  }

  async getAllProducts() {
    const query = 'SELECT * FROM products';
    const result = await getPool().query(query);
    return result.rows;
  }

  async bulkInsertProducts(products) {
    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      for (const product of products) {
        await this.createProduct(product.name, product.description, product.price);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ProductModel();
