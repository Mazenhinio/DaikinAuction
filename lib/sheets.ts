import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Create a single, reusable sheets instance
let sheetsInstance: any = null;

const getSheets = () => {
  if (sheetsInstance) {
    console.log('REUSING existing Google Sheets instance');
    return sheetsInstance;
  }

  console.log('INITIALIZING Google Sheets with environment variables...');
  
  // Get environment variables with proper error handling
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  
  console.log('Environment check:', {
    GOOGLE_SPREADSHEET_ID: spreadsheetId ? 'SET' : 'MISSING',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: clientEmail ? 'SET' : 'MISSING',
    GOOGLE_PRIVATE_KEY: privateKeyRaw ? `SET (${privateKeyRaw.length} chars)` : 'MISSING'
  });
  
  // Validate all required environment variables
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SPREADSHEET_ID environment variable is required');
  }
  if (!clientEmail) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is required');
  }
  if (!privateKeyRaw) {
    throw new Error('GOOGLE_PRIVATE_KEY environment variable is required');
  }

  // Process private key with robust format handling
  let privateKey = privateKeyRaw.trim();
  
  // Remove surrounding quotes if present
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  
  // Replace escaped newlines with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  // Ensure proper PEM format (sometimes the key gets mangled)
  if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Private key must start with -----BEGIN PRIVATE KEY-----');
  }
  if (!privateKey.endsWith('-----END PRIVATE KEY-----')) {
    throw new Error('Private key must end with -----END PRIVATE KEY-----');
  }
  
  // Clean up any extra whitespace but preserve newlines
  privateKey = privateKey.replace(/\r\n/g, '\n'); // Convert Windows line endings
  privateKey = privateKey.replace(/\r/g, '\n');   // Convert old Mac line endings
  
  // Split into lines, trim each line (removes extra spaces), rejoin
  const lines = privateKey.split('\n');
  privateKey = lines.map(line => line.trim()).join('\n');
  
  console.log('Processed private key length:', privateKey.length);
  console.log('Private key starts with:', privateKey.substring(0, 50));
  console.log('Private key ends with:', privateKey.substring(privateKey.length - 50));

  // Create GoogleAuth with required JWT credentials only
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "daikin-auction", 
      private_key_id: "f39e4eb1e2f0f6109323192aa0d5160afd662fc4",
      private_key: privateKey,
      client_email: clientEmail,
      client_id: "116850139086533631153"
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsInstance = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets instance created successfully');
  
  return sheetsInstance;
};

const SHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

const append = async (tab: string, values: any[]) => {
  try {
    const api = getSheets();
    await api.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
    console.log(`Successfully appended to ${tab}`);
  } catch (error) {
    console.error(`Failed to append to ${tab}:`, error);
    throw error;
  }
};

export const appendRegistration = (row: any[]) => append('Registrations', row);
export const appendDownload = (row: any[]) => append('Downloads', row);
export const appendBid = (row: any[]) => append('Bids', row);

// Optional: Helper to ensure sheets exist (basic implementation)
export const ensureSheetExists = async (sheetName: string) => {
  try {
    const api = getSheets();
    const spreadsheet = await api.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    
    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet: any) => sheet.properties?.title === sheetName
    );
    
    if (!sheetExists) {
      await api.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          }],
        },
      });
      console.log(`Created sheet: ${sheetName}`);
    }
  } catch (error) {
    console.error(`Failed to ensure sheet exists: ${sheetName}:`, error);
    // Don't throw - continue with POC even if sheet creation fails
  }
};
