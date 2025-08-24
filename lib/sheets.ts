import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const sheets = () => {
  try {
    // Try to load from JSON file first (more reliable)
    const credentialsPath = path.join(process.cwd(), 'daikin-auction-f39e4eb1e2f0.json');
    
    let credentials;
    if (fs.existsSync(credentialsPath)) {
      console.log('Loading credentials from JSON file...');
      const rawCredentials = fs.readFileSync(credentialsPath, 'utf8');
      credentials = JSON.parse(rawCredentials);
    } else {
      console.log('JSON file not found, creating from environment variables...');
      
      // Create the full service account object structure that Google expects
      credentials = {
        type: "service_account",
        project_id: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.split('@')[1]?.split('.')[0] || '',
        private_key_id: "",
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: "",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '')}`
      };
      
      // Write the JSON file so it exists for next time (in serverless function)
      try {
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
        console.log('Created service account JSON file from environment variables');
      } catch (writeError) {
        console.log('Could not write JSON file, continuing with in-memory credentials');
      }
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
