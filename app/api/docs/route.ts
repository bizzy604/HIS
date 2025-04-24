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
                name: 'John Doe Updated',
                status: 'inactive',
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
                required: ['name', 'status', 'startDate'],
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
                  startDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Program start date',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Program end date',
                    nullable: true,
                  },
                },
              },
              example: {
                name: 'Diabetes Management',
                description: 'Comprehensive program for managing diabetes',
                status: 'active',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
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
                  startDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Program start date',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Program end date',
                    nullable: true,
                  },
                },
              },
              example: {
                name: 'Diabetes Management Updated',
                status: 'inactive',
                endDate: '2023-10-31',
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
            description: 'Filter enrollments by client ID',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'programId',
            in: 'query',
            description: 'Filter enrollments by program ID',
            schema: {
              type: 'string',
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
                  status: {
                    type: 'string',
                    enum: ['active', 'completed', 'dropped'],
                    description: 'Enrollment status',
                    default: 'active',
                  },
                  startDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Enrollment start date',
                    default: 'current date',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Enrollment end date',
                    nullable: true,
                  },
                },
              },
              example: {
                clientId: 'client_123',
                programId: 'program_123',
                status: 'active',
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
          '403': {
            description: 'Forbidden - client or program does not belong to the current doctor',
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
                  status: {
                    type: 'string',
                    enum: ['active', 'completed', 'dropped'],
                    description: 'Enrollment status',
                  },
                  startDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Enrollment start date',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Enrollment end date',
                    nullable: true,
                  },
                },
              },
              example: {
                status: 'completed',
                endDate: '2023-10-31',
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
            name: 'startDate',
            in: 'query',
            description: 'Filter analytics by start date',
            schema: {
              type: 'string',
              format: 'date',
            },
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'Filter analytics by end date',
            schema: {
              type: 'string',
              format: 'date',
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
            description: 'Unique identifier for the client',
          },
          name: {
            type: 'string',
            description: 'Client name',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Client email address',
            nullable: true,
          },
          phone: {
            type: 'string',
            description: 'Client phone number',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Client status',
          },
          lastVisit: {
            type: 'string',
            format: 'date-time',
            description: 'Last visit date',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
          },
          doctorId: {
            type: 'string',
            description: 'ID of the doctor who created the client',
          },
          enrollments: {
            type: 'array',
            description: 'List of enrollments for this client',
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
            description: 'Unique identifier for the program',
          },
          name: {
            type: 'string',
            description: 'Program name',
          },
          description: {
            type: 'string',
            description: 'Program description',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Program status',
          },
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Program start date',
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'Program end date',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
          },
          doctorId: {
            type: 'string',
            description: 'ID of the doctor who created the program',
          },
          enrollments: {
            type: 'array',
            description: 'List of enrollments for this program',
            items: {
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
                client: {
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
                  },
                },
              },
            },
          },
        },
      },
      Enrollment: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the enrollment',
          },
          clientId: {
            type: 'string',
            description: 'ID of the enrolled client',
          },
          programId: {
            type: 'string',
            description: 'ID of the program',
          },
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Enrollment start date',
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'Enrollment end date',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['active', 'completed', 'dropped'],
            description: 'Enrollment status',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
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
              totalClients: {
                type: 'integer',
                description: 'Total number of clients',
              },
              activeClients: {
                type: 'integer',
                description: 'Number of active clients',
              },
              totalPrograms: {
                type: 'integer',
                description: 'Total number of programs',
              },
              activePrograms: {
                type: 'integer',
                description: 'Number of active programs',
              },
              totalEnrollments: {
                type: 'integer',
                description: 'Total number of enrollments',
              },
            },
          },
          enrollmentRate: {
            type: 'number',
            format: 'float',
            description: 'Average enrollment rate as a percentage',
          },
          completionRate: {
            type: 'number',
            format: 'float',
            description: 'Average completion rate as a percentage',
          },
          monthlyEnrollments: {
            type: 'array',
            description: 'Monthly enrollment counts',
            items: {
              type: 'object',
              properties: {
                month: {
                  type: 'string',
                  description: 'Month name (e.g., "Jan")',
                },
                count: {
                  type: 'integer',
                  description: 'Number of enrollments for the month',
                },
              },
            },
          },
          programDistribution: {
            type: 'array',
            description: 'Distribution of clients across programs',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Program name',
                },
                value: {
                  type: 'integer',
                  description: 'Number of clients enrolled in the program',
                },
              },
            },
          },
          clientStatusDistribution: {
            type: 'array',
            description: 'Distribution of clients by status',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Status name (e.g., "Active")',
                },
                value: {
                  type: 'integer',
                  description: 'Number of clients with the status',
                },
              },
            },
          },
          recentActivity: {
            type: 'array',
            description: 'Recent client activities',
            items: {
              type: 'object',
              properties: {
                clientId: {
                  type: 'string',
                  description: 'Client ID',
                },
                clientName: {
                  type: 'string',
                  description: 'Client name',
                },
                programId: {
                  type: 'string',
                  description: 'Program ID',
                },
                programName: {
                  type: 'string',
                  description: 'Program name',
                },
                action: {
                  type: 'string',
                  description: 'Action type (e.g., "Enrolled", "Completed")',
                },
                date: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Action date',
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
