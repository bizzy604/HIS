// E2E test setup - Node environment only, no React/JSX mocking needed

// Mock Clerk server helpers to avoid importing ESM runtime in tests
jest.mock('@clerk/nextjs/server', () => ({
  __esModule: true,
  currentUser: jest.fn().mockResolvedValue(null),
}));
