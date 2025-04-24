import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

// API route to serve OpenAPI documentation
export async function GET() {
  return NextResponse.json(getApiDocs());
}
