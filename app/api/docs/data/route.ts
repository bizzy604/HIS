import { NextResponse } from 'next/server';

// API documentation content
const apiDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Health Information System API',
    version: '1.0.0',
    description: 'API for managing clients, programs, and enrollments in the Health Information System',
  },
  paths: {
    '/api/clients': {
      get: {
        summary: 'Get all clients',
        description: 'Returns a list of all clients for the current doctor',
        responses: {
          '200': {
            description: 'A list of clients',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Client',
                  },
                },
                example: [
                  {
                    id: 'client_123',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '555-123-4567',
                    status: 'active',
                    lastVisit: '2023-01-15T00:00:00.000Z',
                    createdAt: '2022-12-01T00:00:00.000Z',
                    updatedAt: '2023-01-15T00:00:00.000Z',
                    doctorId: 'doctor_123',
                    enrollments: [
                      {
                        id: 'enrollment_123',
                        programId: 'program_123',
                        program: {
                          id: 'program_123',
                          name: 'Diabetes Management',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        summary: 'Create a new client',
        description: 'Creates a new client for the current doctor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'status'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Client name',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Client email address',
                  },
                  phone: {
                    type: 'string',
                    description: 'Client phone number',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Client status',
                  },
                },
              },
              example: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '555-123-4567',
                status: 'active',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Client created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/api/clients/{id}': {
      get: {
        summary: 'Get a client by ID',
        description: 'Returns a client by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the client to get',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'A client object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - client does not belong to the current doctor',
          },
          '404': {
            description: 'Client not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      put: {
        summary: 'Update a client',
        description: 'Updates a client by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the client to update',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Client name',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Client email address',
                  },
                  phone: {
                    type: 'string',
                    description: 'Client phone number',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Client status',
                  },
                },
              },
              example: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '555-123-4567',
                status: 'active',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Client updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - client does not belong to the current doctor',
          },
          '404': {
            description: 'Client not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        summary: 'Delete a client',
        description: 'Deletes a client by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the client to delete',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Client deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - client does not belong to the current doctor',
          },
          '404': {
            description: 'Client not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/api/programs': {
      get: {
        summary: 'Get all programs',
        description: 'Returns a list of all programs for the current doctor',
        responses: {
          '200': {
            description: 'A list of programs',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Program',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        summary: 'Create a new program',
        description: 'Creates a new program for the current doctor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Program name',
                  },
                  description: {
                    type: 'string',
                    description: 'Program description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Program status',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Program created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Program',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/api/programs/{id}': {
      get: {
        summary: 'Get a program by ID',
        description: 'Returns a program by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the program to get',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'A program object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Program',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - program does not belong to the current doctor',
          },
          '404': {
            description: 'Program not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      put: {
        summary: 'Update a program',
        description: 'Updates a program by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the program to update',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Program name',
                  },
                  description: {
                    type: 'string',
                    description: 'Program description',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'Program status',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Program updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Program',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - program does not belong to the current doctor',
          },
          '404': {
            description: 'Program not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        summary: 'Delete a program',
        description: 'Deletes a program by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the program to delete',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Program deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - program does not belong to the current doctor',
          },
          '404': {
            description: 'Program not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/api/enrollments': {
      get: {
        summary: 'Get all enrollments',
        description: 'Returns a list of all enrollments for the current doctor',
        parameters: [
          {
            name: 'clientId',
            in: 'query',
            required: false,
            description: 'Filter enrollments by client ID',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'programId',
            in: 'query',
            required: false,
            description: 'Filter enrollments by program ID',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            description: 'Filter enrollments by status',
            schema: {
              type: 'string',
              enum: ['active', 'completed', 'canceled'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'A list of enrollments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Enrollment',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        summary: 'Create a new enrollment',
        description: 'Creates a new enrollment for a client in a program',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clientId', 'programId'],
                properties: {
                  clientId: {
                    type: 'string',
                    description: 'ID of the client to enroll',
                  },
                  programId: {
                    type: 'string',
                    description: 'ID of the program to enroll in',
                  },
                  startDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start date of the enrollment',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'End date of the enrollment',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'completed', 'canceled'],
                    description: 'Status of the enrollment',
                  },
                  notes: {
                    type: 'string',
                    description: 'Notes about the enrollment',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Enrollment created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Enrollment',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '404': {
            description: 'Client or program not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/api/enrollments/{id}': {
      get: {
        summary: 'Get an enrollment by ID',
        description: 'Returns an enrollment by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the enrollment to get',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'An enrollment object',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Enrollment',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - enrollment does not belong to the current doctor',
          },
          '404': {
            description: 'Enrollment not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      put: {
        summary: 'Update an enrollment',
        description: 'Updates an enrollment by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the enrollment to update',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  startDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start date of the enrollment',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'End date of the enrollment',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'completed', 'canceled'],
                    description: 'Status of the enrollment',
                  },
                  notes: {
                    type: 'string',
                    description: 'Notes about the enrollment',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Enrollment updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Enrollment',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - enrollment does not belong to the current doctor',
          },
          '404': {
            description: 'Enrollment not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        summary: 'Delete an enrollment',
        description: 'Deletes an enrollment by ID if it belongs to the current doctor',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the enrollment to delete',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Enrollment deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden - enrollment does not belong to the current doctor',
          },
          '404': {
            description: 'Enrollment not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/api/analytics': {
      get: {
        summary: 'Get analytics data',
        description: 'Returns analytics data for the current doctor',
        parameters: [
          {
            name: 'period',
            in: 'query',
            required: false,
            description: 'Period to calculate analytics for',
            schema: {
              type: 'string',
              enum: ['week', 'month', 'quarter', 'year'],
              default: 'month',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Analytics data',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Analytics',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Client: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Client ID',
          },
          name: {
            type: 'string',
            description: 'Client name',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Client email address',
          },
          phone: {
            type: 'string',
            description: 'Client phone number',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Client status',
          },
          lastVisit: {
            type: 'string',
            format: 'date-time',
            description: 'Date of last visit',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date the client was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date the client was last updated',
          },
          doctorId: {
            type: 'string',
            description: 'ID of the doctor the client belongs to',
          },
          enrollments: {
            type: 'array',
            description: 'List of programs the client is enrolled in',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Enrollment ID',
                },
                programId: {
                  type: 'string',
                  description: 'Program ID',
                },
                program: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Program ID',
                    },
                    name: {
                      type: 'string',
                      description: 'Program name',
                    },
                  },
                },
              },
            },
          },
        },
      },
      Program: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Program ID',
          },
          name: {
            type: 'string',
            description: 'Program name',
          },
          description: {
            type: 'string',
            description: 'Program description',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Program status',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date the program was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date the program was last updated',
          },
          doctorId: {
            type: 'string',
            description: 'ID of the doctor the program belongs to',
          },
          enrollmentCount: {
            type: 'integer',
            description: 'Number of clients enrolled in the program',
          },
        },
      },
      Enrollment: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Enrollment ID',
          },
          clientId: {
            type: 'string',
            description: 'Client ID',
          },
          programId: {
            type: 'string',
            description: 'Program ID',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Start date of the enrollment',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'End date of the enrollment',
          },
          status: {
            type: 'string',
            enum: ['active', 'completed', 'canceled'],
            description: 'Status of the enrollment',
          },
          notes: {
            type: 'string',
            description: 'Notes about the enrollment',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date the enrollment was created',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date the enrollment was last updated',
          },
          client: {
            $ref: '#/components/schemas/Client',
          },
          program: {
            $ref: '#/components/schemas/Program',
          },
        },
      },
      Analytics: {
        type: 'object',
        properties: {
          counts: {
            type: 'object',
            properties: {
              clients: {
                type: 'integer',
                description: 'Total number of clients',
              },
              activeClients: {
                type: 'integer',
                description: 'Number of active clients',
              },
              programs: {
                type: 'integer',
                description: 'Total number of programs',
              },
              activePrograms: {
                type: 'integer',
                description: 'Number of active programs',
              },
              enrollments: {
                type: 'integer',
                description: 'Total number of enrollments',
              },
              activeEnrollments: {
                type: 'integer',
                description: 'Number of active enrollments',
              },
            },
          },
          trends: {
            type: 'object',
            properties: {
              newClients: {
                type: 'array',
                description: 'Number of new clients over time',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'string',
                      format: 'date',
                      description: 'Date',
                    },
                    count: {
                      type: 'integer',
                      description: 'Count for that date',
                    },
                  },
                },
              },
              newEnrollments: {
                type: 'array',
                description: 'Number of new enrollments over time',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'string',
                      format: 'date',
                      description: 'Date',
                    },
                    count: {
                      type: 'integer',
                      description: 'Count for that date',
                    },
                  },
                },
              },
              completedEnrollments: {
                type: 'array',
                description: 'Number of completed enrollments over time',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'string',
                      format: 'date',
                      description: 'Date',
                    },
                    count: {
                      type: 'integer',
                      description: 'Count for that date',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// GET handler to return the API documentation JSON
export async function GET() {
  return NextResponse.json(apiDocs);
}
