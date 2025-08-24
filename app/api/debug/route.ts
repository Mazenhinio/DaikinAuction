import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const envStatus = {
      GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID ? 'SET' : 'MISSING',
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'SET' : 'MISSING',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'SET' : 'MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      VERCEL_ENV: process.env.VERCEL_ENV || 'undefined',
    };

    return NextResponse.json({
      ok: true,
      message: 'Environment variables status',
      env: envStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Debug check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
