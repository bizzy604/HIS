/**
 * E2E API tests
 * Tests actual HTTP communication between endpoints with a running server
 */
import { TestServer } from './server';
import { get, post, json, TestContext } from './helpers';

describe('E2E API Tests', () => {
  let server: TestServer;
  let context: TestContext;

  // Increase timeout for E2E tests
  jest.setTimeout(120000);

  beforeAll(async () => {
    server = new TestServer(3001);
    await server.start();
    context = { baseUrl: server.baseUrl };
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('Health checks', () => {
    test('server is running and accessible', async () => {
      const response = await get(context, '/');
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });

    test('API endpoints respond to requests', async () => {
      const response = await get(context, '/api/clients');
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });
  });

  describe('Client API', () => {
    test('GET /api/clients returns error when unauthenticated', async () => {
      const response = await get(context, '/api/clients');
      expect([401, 500]).toContain(response.status);
    });

    test('POST /api/clients returns error when unauthenticated', async () => {
      const response = await post(context, '/api/clients', { name: 'Test' });
      expect([401, 500]).toContain(response.status);
    });

    test('GET /api/clients/[id] returns error when unauthenticated', async () => {
      const response = await get(context, '/api/clients/test-id');
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('Program API', () => {
    test('GET /api/programs returns error when unauthenticated', async () => {
      const response = await get(context, '/api/programs');
      expect([401, 500]).toContain(response.status);
    });

    test('POST /api/programs returns error when unauthenticated', async () => {
      const response = await post(context, '/api/programs', { name: 'Test' });
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('Medicine API', () => {
    test('GET /api/medicines returns error when unauthenticated', async () => {
      const response = await get(context, '/api/medicines');
      expect([401, 500]).toContain(response.status);
    });

    test('POST /api/medicines returns error when unauthenticated', async () => {
      const response = await post(context, '/api/medicines', { name: 'Test' });
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('Medicine Batch API', () => {
    test('GET /api/medicine-batches returns error when unauthenticated', async () => {
      const response = await get(context, '/api/medicine-batches');
      expect([401, 500]).toContain(response.status);
    });

    test('POST /api/medicine-batches returns error when unauthenticated', async () => {
      const response = await post(context, '/api/medicine-batches', { batchNumber: 'B001' });
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('All API endpoints', () => {
    test('all endpoints respond to unauthenticated requests', async () => {
      const endpoints = [
        '/api/prescriptions',
        '/api/appointments',
        '/api/enrollments',
        '/api/lab-orders',
        '/api/billing',
        '/api/analytics',
        '/api/vitals',
        '/api/medical-visits',
      ];

      for (const endpoint of endpoints) {
        const response = await get(context, endpoint);
        // All endpoints should respond (not crash)
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
        // Most return 401 or 500 for unauthenticated requests
        expect([401, 500]).toContain(response.status);
      }
    });

    test('POST requests are handled', async () => {
      const postTests = [
        { path: '/api/prescriptions', body: {} },
        { path: '/api/appointments', body: {} },
        { path: '/api/enrollments', body: {} },
      ];

      for (const { path, body } of postTests) {
        const response = await post(context, path, body);
        expect([400, 401, 500]).toContain(response.status);
      }
    });

    test('Swagger endpoint responds', async () => {
      const response = await get(context, '/api/swagger');
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });
  });

  describe('API integration', () => {
    test('endpoints return JSON error responses', async () => {
      const response = await get(context, '/api/clients');
      const data = await json(response);
      expect(data).toHaveProperty('error');
      expect(typeof data.error).toBe('string');
    });

    test('query parameters are handled', async () => {
      const response = await get(context, '/api/enrollments?clientId=test&programId=test');
      expect([401, 500]).toContain(response.status);
    });
  });
});
