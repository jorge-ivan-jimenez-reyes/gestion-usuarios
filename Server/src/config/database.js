const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }

  async connect() {
    try {
      await this.pool.query('SELECT NOW()');
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }

  getPool() {
    return this.pool;
  }
}

const database = new Database();

module.exports = {
  connectToDatabase: () => database.connect(),
  getPool: () => database.getPool(),
};
