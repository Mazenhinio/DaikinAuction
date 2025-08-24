import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const keyFilePath = path.join(process.cwd(), 'daikin-auction-f39e4eb1e2f0.json');
    const fileExists = fs.existsSync(keyFilePath);
    
    const envCheck = {
      GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID ? 'SET' : 'MISSING',
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'SET' : 'MISSING',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? `SET (${process.env.GOOGLE_PRIVATE_KEY?.length} chars)` : 'MISSING'
    };
    
    let fileContents = null;
    if (fileExists) {
      try {
        fileContents = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      } catch (e) {
        fileContents = { error: 'Failed to parse JSON file' };
      }
    }
    
    return NextResponse.json({
      jsonFileExists: fileExists,
      jsonFilePath: keyFilePath,
      environmentVariables: envCheck,
      filePreview: fileContents ? {
        client_email: fileContents.client_email,
        private_key_id: fileContents.private_key_id,
        client_id: fileContents.client_id
      } : null,
      processEnv: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
