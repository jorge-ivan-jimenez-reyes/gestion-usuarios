const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User and Product Management API',
      version: '1.0.0',
      description: 'API for managing users and products',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
