const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project API",
      version: "1.0.0",
      description: "CSE341 Project API",
    },
    servers: [
      {
        url: "https://cse341-user-project.onrender.com/",
      },
    ],

    components: {
      securitySchemes: {
        OAuth2: {
          type: "oauth2",
          flows: {
            authorization: {
              authorizationUrl: "/auth/google",
              tokenUrl: "/auth/token"
            }
          }
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);