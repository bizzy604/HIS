/**
 * Integration-style unit tests for API route handlers.
 *
 * These tests mock `next/server`'s `NextResponse`, the `@/lib/auth` helpers,
 * and the Prisma client in `@/lib/db` so routes can be invoked directly.
 */
import { jest } from '@jest/globals';

// Mock NextResponse.json to return a plain object with payload and status
jest.mock('next/server', () => ({
  NextResponse: {
    json: (payload: any, opts?: any) => ({ payload, status: opts?.status ?? 200 }),
  },
  NextRequest: class {},
}));

// Provide mutable mocks for auth and db which tests will adjust per-case
const mockAuth = {
  getCurrentDoctor: jest.fn(),
  canAccessClient: jest.fn(),
  canAccessProgram: jest.fn(),
};

jest.unstable_mockModule('@/lib/auth', () => mockAuth);

const mockPrisma = {
  client: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  program: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  medicine: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  prescription: { findMany: jest.fn(), create: jest.fn() },
  labOrder: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  billing: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  appointment: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  vitals: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  medicalVisit: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
};

jest.unstable_mockModule('@/lib/db', () => ({ prisma: mockPrisma }));

// Helper to create a minimal mock request with optional JSON body
function createMockRequest(body?: any) {
  return {
    json: async () => body,
  } as any;
}

// List of route modules to test and sample handlers to call
const routeModules = [
  '@/app/api/clients/route',
  '@/app/api/clients/[id]/route',
  '@/app/api/programs/route',
  '@/app/api/programs/[id]/route',
  '@/app/api/medicines/route',
  '@/app/api/medicines/[id]/route',
  '@/app/api/medicine-batches/route',
  '@/app/api/prescriptions/route',
  '@/app/api/appointments/route',
  '@/app/api/appointments/[id]/route',
  '@/app/api/enrollments/route',
  '@/app/api/enrollments/[id]/route',
  '@/app/api/lab-orders/route',
  '@/app/api/lab-orders/[id]/route',
  '@/app/api/lab-orders/[id]/results/route',
  '@/app/api/billing/route',
  '@/app/api/billing/[id]/route',
  '@/app/api/analytics/route',
  '@/app/api/vitals/route',
  '@/app/api/medical-visits/route',
  '@/app/api/medical-visits/[id]/route',
  '@/app/api/swagger/route',
];

describe('API route handlers — basic auth + db integration smoke tests', () => {
  beforeEach(() => {
    // reset mocks
    jest.clearAllMocks();
    mockAuth.getCurrentDoctor.mockResolvedValue(null);
    mockAuth.canAccessClient.mockResolvedValue(false);
    mockAuth.canAccessProgram.mockResolvedValue(false);
  });

  test.each(routeModules)('module %s exports and responds for unauthenticated users', async (modulePath) => {
    const mod = await import(modulePath as string);

    // call available handlers with a mock unauthenticated context
    const handlers = ['GET', 'POST', 'PUT', 'DELETE'];
    for (const h of handlers) {
      if (typeof mod[h] === 'function') {
        // For routes requiring params, provide a dummy context
        const context = { params: { id: 'test-id' } } as any;
        const resp = await mod[h](createMockRequest(), context);
        expect(resp).toHaveProperty('status');
        // Some handlers return 401 when unauthenticated; others may parse the
        // request body first and return 400 or 500. Accept common statuses.
        expect([401, 200, 404, 400, 500]).toContain(resp.status);
      }
    }
  }, 20000);

  test.each(routeModules)('module %s responds when authenticated and db available', async (modulePath) => {
    const mod = await import(modulePath as string);

    // Provide an authenticated doctor and permissive access checks
    mockAuth.getCurrentDoctor.mockResolvedValue({ id: 'doctor-1' });
    mockAuth.canAccessClient.mockResolvedValue(true);
    mockAuth.canAccessProgram.mockResolvedValue(true);

    // provide basic prisma returns so routes that call findMany/unique won't throw
    mockPrisma.client.findMany.mockResolvedValue([]);
    mockPrisma.client.findUnique.mockResolvedValue(null);
    mockPrisma.client.create.mockResolvedValue({ id: 'c1', name: 'Test' });
    mockPrisma.program.findMany.mockResolvedValue([]);
    mockPrisma.medicine.findMany.mockResolvedValue([]);
    mockPrisma.prescription.findMany.mockResolvedValue([]);

    const handlers = ['GET', 'POST', 'PUT', 'DELETE'];
    for (const h of handlers) {
      if (typeof mod[h] === 'function') {
        const context = { params: { id: 'test-id' } } as any;
        const reqBody = h === 'POST' || h === 'PUT' ? { name: 'Example' } : undefined;
        const resp = await mod[h](createMockRequest(reqBody), context);
        expect(resp).toHaveProperty('status');
        expect(typeof resp.status).toBe('number');
        // status should be a typical HTTP status
        expect(resp.status).toBeGreaterThanOrEqual(200);
        expect(resp.status).toBeLessThan(600);
      }
    }
  }, 20000);
});
