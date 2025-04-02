const { getPool } = require('../config/database');

class UserModel {
  async createUser(username, email, hashedPassword) {
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const values = [username, email, hashedPassword];
    const result = await getPool().query(query, values);
    return result.rows[0].id;
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await getPool().query(query, [email]);
    return result.rows[0];
  }

  async updateUser(userId, updatedFields) {
    const setClause = Object.keys(updatedFields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [userId, ...Object.values(updatedFields)];
    const result = await getPool().query(query, values);
    return result.rows[0];
  }
}

module.exports = new UserModel();
