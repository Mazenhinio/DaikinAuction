import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing Google Sheets connection...');
    
    // Test 1: Environment Variables
    const envTest = {
      GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID ? 'SET' : 'MISSING',
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'SET' : 'MISSING',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? `SET (${process.env.GOOGLE_PRIVATE_KEY.length} chars)` : 'MISSING'
    };
    
    // Test 2: Try Google Auth Setup
    const { google } = require('googleapis');
    
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    console.log('Credentials setup:', {
      email: credentials.client_email,
      keyLength: credentials.private_key?.length,
      keyStartsWith: credentials.private_key?.substring(0, 50)
    });
    
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test 3: Try to access the spreadsheet
    const SHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;
    
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    
    const sheetNames = spreadsheetInfo.data.sheets?.map(sheet => sheet.properties?.title) || [];
    
    return NextResponse.json({
      ok: true,
      message: "Google Sheets connection successful!",
      tests: {
        environmentVariables: envTest,
        authSetup: "SUCCESS",
        spreadsheetAccess: "SUCCESS",
        sheetNames: sheetNames,
        spreadsheetTitle: spreadsheetInfo.data.properties?.title
      }
    });
    
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    
    return NextResponse.json({
      ok: false,
      message: "Google Sheets connection failed",
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: typeof error,
        code: (error as any)?.code,
        status: (error as any)?.status,
        details: (error as any)?.response?.data || (error as any)?.details
      }
    }, { status: 500 });
  }
}
