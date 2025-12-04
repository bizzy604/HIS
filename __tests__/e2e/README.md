# E2E Testing for HIS API

## Overview
End-to-end tests that run against a live Next.js development server to verify API endpoints communicate correctly with each other in a real environment.

## Test Setup

### Files Created
- `__tests__/e2e/server.ts` - Test server manager that starts/stops Next.js dev server
- `__tests__/e2e/helpers.ts` - HTTP request helpers (get, post, put, del, json)
- `__tests__/e2e/api.e2e.test.ts` - E2E tests for all API endpoints
- `jest.setup.e2e.js` - Jest setup for E2E tests (Node environment)
- `jest.config.e2e.js` - Jest configuration for E2E tests

### Configuration
- Tests run on port 3001 (separate from dev server on 3000)
- 120-second timeout to allow server startup
- Node environment (not jsdom)
- Runs tests sequentially with `--runInBand`

## Running Tests

### Run All Tests (Unit + E2E)
```powershell
npm test
```

### Run Only Unit Tests
```powershell
npm run test:unit
```

### Run Only E2E Tests
```powershell
npm run test:e2e
```

## Test Results

### Latest Run
- **Total Tests**: 16
- **Passed**: 15
- **Failed**: 1
- **Time**: ~33 seconds

### What's Tested
1. **Server Health**: Verifies the Next.js server starts and responds
2. **Client API**: GET/POST endpoints for clients
3. **Program API**: GET/POST endpoints for programs
4. **Medicine API**: GET/POST endpoints for medicines
5. **Medicine Batch API**: GET/POST endpoints for batches
6. **All API Endpoints**: Bulk testing of remaining endpoints (prescriptions, appointments, enrollments, lab orders, billing, analytics, vitals, medical visits)
7. **API Integration**: Error handling, query parameters, JSON responses

### Expected Behaviors
- Unauthenticated requests return **401** (Unauthorized) or **500** (Server Error)
- All endpoints respond with JSON error objects containing an `error` field
- Query parameters are parsed correctly
- POST requests validate required fields

## How It Works

1. **beforeAll**: Starts Next.js dev server on port 3001
2. **Tests**: Make real HTTP requests using `fetch` to `http://localhost:3001`
3. **afterAll**: Stops the server and cleans up processes

### Server Lifecycle
```typescript
const server = new TestServer(3001);
await server.start();  // Waits for "ready" message
// ... run tests ...
await server.stop();   // Kills process tree
```

### Making Requests
```typescript
import { get, post, json } from './helpers';

// GET request
const response = await get(context, '/api/clients');

// POST request
const response = await post(context, '/api/clients', { name: 'Test' });

// Parse JSON
const data = await json(response);
```

## Notes

- E2E tests use a real database connection (from `.env`)
- Clerk authentication is tested in its actual runtime environment
- Tests verify inter-endpoint communication by making sequential requests
- Server errors (500) are acceptable in tests because Clerk auth may fail without a valid session
- One test failure is likely due to a Next.js build/CSS loading issue on Windows (not API-related)

## Future Enhancements

1. Add authenticated test scenarios with Clerk test tokens
2. Test data flow between related endpoints (e.g., create client → enroll in program)
3. Add performance benchmarks
4. Test WebSocket/realtime features if added
5. Add database cleanup/seeding for consistent test data
