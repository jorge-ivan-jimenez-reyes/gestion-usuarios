require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./config/database');
const logger = require('./config/logger');

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
