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

  console.log('CREATING Google Service Account JSON file from environment variables...');
  
  // Create the EXACT JSON structure that Google provided and that worked locally
  const serviceAccountJson = {
    "type": "service_account",
    "project_id": "daikin-auction",
    "private_key_id": "f39e4eb1e2f0f6109323192aa0d5160afd662fc4",
    "private_key": process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    "client_id": "116850139086533631153",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mazen-khalil%40daikin-auction.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };

  console.log('Service account setup:', {
    email: serviceAccountJson.client_email,
    keyLength: serviceAccountJson.private_key.length,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
  });

  // Write the JSON file exactly as Google provided it
  const credentialsPath = path.join(process.cwd(), 'daikin-auction-f39e4eb1e2f0.json');
  fs.writeFileSync(credentialsPath, JSON.stringify(serviceAccountJson, null, 2));
  console.log('Created service account JSON file at:', credentialsPath);

  // Use the EXACT same approach that worked locally - load from JSON file
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsInstance = google.sheets({ version: 'v4', auth });
  console.log('Google Sheets instance created successfully using JSON file approach');
  
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
