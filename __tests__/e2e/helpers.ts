/**
 * E2E test helpers
 * Utilities for making authenticated requests and managing test data
 */

export interface TestContext {
  baseUrl: string;
  authToken?: string;
}

/**
 * Make an HTTP request to the test server
 */
export async function request(
  context: TestContext,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${context.baseUrl}${path}`;
  const headers = new Headers(options.headers);
  
  if (context.authToken) {
    headers.set('Authorization', `Bearer ${context.authToken}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Make a GET request
 */
export async function get(context: TestContext, path: string): Promise<Response> {
  return request(context, path, { method: 'GET' });
}

/**
 * Make a POST request
 */
export async function post(
  context: TestContext,
  path: string,
  body: any
): Promise<Response> {
  return request(context, path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Make a PUT request
 */
export async function put(
  context: TestContext,
  path: string,
  body: any
): Promise<Response> {
  return request(context, path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Make a DELETE request
 */
export async function del(context: TestContext, path: string): Promise<Response> {
  return request(context, path, { method: 'DELETE' });
}

/**
 * Parse JSON response
 */
export async function json(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => Promise<boolean>,
  timeout: number = 10000,
  interval: number = 100
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}
