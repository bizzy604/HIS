import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Path to API routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'HIS Dashboard API Documentation',
        version: '1.0.0',
        description: 'Documentation for the Healthcare Information System API',
      },
      servers: [
        {
          url: '/api',
          description: 'API Server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });
  return spec;
};
