import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Helper function to properly format the private key
const formatPrivateKey = (key: string | undefined): string => {
  if (!key) return '';
  
  console.log('Original key length:', key.length);
  console.log('Original key preview:', key.substring(0, 100) + '...');
  
  // Handle different possible formats of the private key
  let processedKey = key;
  
  // Replace literal \n with actual newlines
  if (key.includes('\\n')) {
    processedKey = key.replace(/\\n/g, '\n');
    console.log('Replaced \\n with newlines');
  }
  
  // If key doesn't have proper headers, add them
  if (!processedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.log('Adding headers to key without them');
    processedKey = `-----BEGIN PRIVATE KEY-----\n${processedKey}\n-----END PRIVATE KEY-----`;
  }
  
  // Clean up any malformed line breaks
  processedKey = processedKey
    .replace(/\r\n/g, '\n') // Handle Windows line endings
    .replace(/\r/g, '\n')   // Handle old Mac line endings
    .replace(/\n\s+/g, '\n') // Remove spaces after newlines
    .replace(/\n+/g, '\n')   // Replace multiple newlines with single
    .trim();
  
  console.log('Processed key length:', processedKey.length);
  console.log('Processed key preview:', processedKey.substring(0, 100) + '...');
  
  return processedKey;
};

const sheets = () => {
  try {
    console.log('FORCE: Using ONLY environment variables (bypassing JSON file)...');
    
    // FORCE use environment variables only - don't create or load JSON files
    const credentials = {
      type: "service_account",
      project_id: "daikin-auction", // Hard-coded correct project ID
      private_key_id: "f39e4eb1e2f0f6109323192aa0d5160afd662fc4", // Hard-coded from working JSON
      private_key: formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: "116850139086533631153", // Hard-coded from working JSON
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/mazen-khalil%40daikin-auction.iam.gserviceaccount.com`,
      universe_domain: "googleapis.com" // From working JSON
    }

    console.log('Auth setup:', {
      email: credentials.client_email,
      keyLength: credentials.private_key?.length,
      usingJsonFile: fs.existsSync(credentialsPath)
    });

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Failed to initialize Google Sheets auth:', error);
    throw error;
  }
};

const SHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

const append = async (tab: string, values: any[]) => {
  try {
    const api = sheets();
    await api.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
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
    const api = sheets();
    const spreadsheet = await api.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });
    
    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === sheetName
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
