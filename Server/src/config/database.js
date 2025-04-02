const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
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
