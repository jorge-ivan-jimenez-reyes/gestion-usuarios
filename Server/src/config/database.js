const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

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
      logger.info('Attempting to connect to the database...');
      await this.pool.query('SELECT NOW()');
      logger.info('Successfully connected to the database');
      await this.runMigrations();
    } catch (error) {
      logger.error('Error connecting to the database:', error);
      throw error;
    }
  }

  async runMigrations() {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Create migrations table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Get list of migration files
      const migrationsDir = path.join(__dirname, '..', 'migrations');
      const migrationFiles = await fs.readdir(migrationsDir);

      // Sort migration files to ensure they're executed in order
      migrationFiles.sort();

      for (const file of migrationFiles) {
        const migrationName = path.parse(file).name;

        // Check if migration has already been executed
        const { rows } = await client.query('SELECT * FROM migrations WHERE name = $1', [migrationName]);
        
        if (rows.length === 0) {
          logger.info(`Executing migration: ${migrationName}`);
          const migrationPath = path.join(migrationsDir, file);
          const migrationSql = await fs.readFile(migrationPath, 'utf-8');
          
          try {
            await client.query(migrationSql);
            await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationName]);
            logger.info(`Migration ${migrationName} executed successfully`);
          } catch (migrationError) {
            logger.warn(`Error executing migration ${migrationName}: ${migrationError.message}`);
            logger.warn('Continuing with the next migration...');
          }
        } else {
          logger.info(`Migration ${migrationName} already executed, skipping`);
        }
      }

      await client.query('COMMIT');
      logger.info('All migrations processed');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error processing migrations:', error);
    } finally {
      client.release();
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
