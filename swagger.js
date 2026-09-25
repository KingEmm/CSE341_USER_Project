const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE341 API',
      version: '1.0.0',
      description: 'My REST API'
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsDoc(options);