const { getPool } = require('../config/database');

class ServiceModel {
  async createService(name, description, price, duration, category) {
    const query = 'INSERT INTO services (name, description, price, duration, category) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const values = [name, description, price, duration, category];
    const result = await getPool().query(query, values);
    return result.rows[0].id;
  }

  async getServiceById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    const result = await getPool().query(query, [id]);
    return result.rows[0];
  }

  async updateService(id, updatedFields) {
    const setClause = Object.keys(updatedFields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const query = `UPDATE services SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [id, ...Object.values(updatedFields)];
    const result = await getPool().query(query, values);
    return result.rows[0];
  }

  async deleteService(id) {
    const query = 'DELETE FROM services WHERE id = $1 RETURNING *';
    const result = await getPool().query(query, [id]);
    return result.rows[0];
  }

  async getAllServices(queryParams, sortOption) {
    let query = 'SELECT * FROM services';
    const values = [];
    const whereClause = [];

    if (queryParams.name) {
      whereClause.push(`name ILIKE $${values.length + 1}`);
      values.push(`%${queryParams.name}%`);
    }

    if (queryParams.category) {
      whereClause.push(`category = $${values.length + 1}`);
      values.push(queryParams.category);
    }

    if (queryParams.minPrice) {
      whereClause.push(`price >= $${values.length + 1}`);
      values.push(queryParams.minPrice);
    }

    if (queryParams.maxPrice) {
      whereClause.push(`price <= $${values.length + 1}`);
      values.push(queryParams.maxPrice);
    }

    if (whereClause.length > 0) {
      query += ' WHERE ' + whereClause.join(' AND ');
    }

    if (sortOption) {
      query += ` ORDER BY ${sortOption.field} ${sortOption.direction}`;
    }

    const result = await getPool().query(query, values);
    return result.rows;
  }
}

module.exports = new ServiceModel();
