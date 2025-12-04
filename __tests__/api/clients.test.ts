/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/clients/route';
import { getCurrentDoctor } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Mock dependencies
jest.mock('@/lib/auth', () => ({
  getCurrentDoctor: jest.fn()
}));

jest.mock('@/lib/db', () => ({
  prisma: {
    client: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  }
}));

describe('Clients API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/clients', () => {
    it('should return all clients for the current user', async () => {
      // Mock auth
      (getCurrentDoctor as jest.Mock).mockImplementation(() => Promise.resolve({
        id: 'doctor_123',
      }));

      // Mock database response
      const mockClients = [
        {
          id: 'client_1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          status: 'active',
          doctorId: 'doctor_123',
          createdAt: "2025-04-24T19:04:44.908Z",
          updatedAt: "2025-04-24T19:04:44.908Z",
          lastVisit: null,
          enrollments: [],
        },
      ];
      
      (prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients);

      // Execute the API handler
      const request = new NextRequest('http://localhost/api/clients');
      const response = await GET(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data).toEqual(mockClients);
      expect(getCurrentDoctor).toHaveBeenCalledTimes(1);
      expect(prisma.client.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { doctorId: 'doctor_123' },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          enrollments: {
            include: {
              program: true,
            },
          },
        },
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Mock auth to return null (user not authenticated)
      (getCurrentDoctor as jest.Mock).mockImplementation(() => Promise.resolve(null));

      // Execute the API handler
      const request = new NextRequest('http://localhost/api/clients');
      const response = await GET(request);

      // Assertions
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      // Mock auth
      (getCurrentDoctor as jest.Mock).mockImplementation(() => Promise.resolve({
        id: 'doctor_123',
      }));

      // Mock request body
      const mockClientData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        status: 'active',
      };

      // Mock database response
      const mockCreatedClient = {
        id: 'client_2',
        ...mockClientData,
        doctorId: 'doctor_123',
        createdAt: "2025-04-24T19:04:44.965Z",
        updatedAt: "2025-04-24T19:04:44.965Z",
        lastVisit: null,
      };
      
      (prisma.client.create as jest.Mock).mockResolvedValue(mockCreatedClient);

      // Create request with JSON body
      const request = new NextRequest('http://localhost/api/clients', {
        method: 'POST',
        body: JSON.stringify(mockClientData),
      });
      
      const response = await POST(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedClient);
      expect(getCurrentDoctor).toHaveBeenCalledTimes(1);
      expect(prisma.client.create).toHaveBeenCalledTimes(1);
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          ...mockClientData,
          doctorId: 'doctor_123',
        },
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Mock auth to return null (user not authenticated)
      (getCurrentDoctor as jest.Mock).mockImplementation(() => Promise.resolve(null));

      // Create request with JSON body
      const request = new NextRequest('http://localhost/api/clients', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Client', status: 'active' }),
      });
      
      const response = await POST(request);

      // Assertions
      expect(response.status).toBe(401);
    });

    it('should return 400 if required fields are missing', async () => {
      // Mock auth
      (getCurrentDoctor as jest.Mock).mockImplementation(() => Promise.resolve({
        id: 'doctor_123',
      }));

      // Missing required field (name)
      const mockInvalidData = {
        email: 'test@example.com',
        status: 'active',
      };

      // Create request with invalid JSON body
      const request = new NextRequest('http://localhost/api/clients', {
        method: 'POST',
        body: JSON.stringify(mockInvalidData),
      });
      
      const response = await POST(request);

      // Assertions
      expect(response.status).toBe(400);
    });
  });
});
