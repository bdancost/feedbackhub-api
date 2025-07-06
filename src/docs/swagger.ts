// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FeedbackHub API",
      version: "1.0.0",
      description: "Documentação da API de Feedback",
    },
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
  apis: ["./src/routes/*.ts"], // Caminho para ler as anotações
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiHandler = swaggerUi.serve;
export const swaggerDocHandler = swaggerUi.setup(swaggerSpec);
