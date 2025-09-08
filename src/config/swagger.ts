import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Simple Blog API",
      version: "1.0.0",
      description: "A minimal CRUD API for users and blogs",
    },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
