import 'next';

// Extend Next.js types to properly handle route parameters in Next.js 15.2.4
declare module 'next/server' {
  export interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
}

// This helps fix the type error with dynamic route params
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}
