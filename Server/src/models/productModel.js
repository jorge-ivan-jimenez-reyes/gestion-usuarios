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

  async getAllProducts(queryParams, sortOption) {
    let query = 'SELECT * FROM products';
    const values = [];
    const whereClause = [];

    if (queryParams.$or && queryParams.$or.length > 0) {
      const searchValue = queryParams.$or[0].name.$regex;
      whereClause.push(`(name ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`);
      values.push(`%${searchValue}%`);
    }

    if (queryParams.price) {
      if (queryParams.price.$gte !== undefined) {
        whereClause.push(`price >= $${values.length + 1}`);
        values.push(queryParams.price.$gte);
      }
      if (queryParams.price.$lte !== undefined) {
        whereClause.push(`price <= $${values.length + 1}`);
        values.push(queryParams.price.$lte);
      }
    }

    if (whereClause.length > 0) {
      query += ' WHERE ' + whereClause.join(' AND ');
    }

    if (Object.keys(sortOption).length > 0) {
      const [field, order] = Object.entries(sortOption)[0];
      query += ` ORDER BY ${field} ${order === 1 ? 'ASC' : 'DESC'}`;
    }

    const result = await getPool().query(query, values);
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
