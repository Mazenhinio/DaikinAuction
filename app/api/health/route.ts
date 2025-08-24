import { NextResponse } from 'next/server';

// Simple health check that doesn't depend on external services
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Daikin Auction API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
