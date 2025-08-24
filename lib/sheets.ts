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

  console.log('INITIALIZING Google Sheets with JSON file (LOCAL APPROACH)...');
  
  try {
    // First try to use the JSON file (works locally and Vercel will use env vars)
    const keyFilePath = path.join(process.cwd(), 'daikin-auction-f39e4eb1e2f0.json');
    
    let credentials;
    
    if (fs.existsSync(keyFilePath)) {
      console.log('✅ Found service account JSON file, using file-based auth');
      const keyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      credentials = keyFile;
    } else {
      console.log('⚠️ JSON file not found, falling back to environment variables');
      
      // Fallback to environment variables (for Vercel)
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
      
      if (!spreadsheetId || !clientEmail || !privateKeyRaw) {
        throw new Error('Missing required credentials: JSON file not found and env vars incomplete');
      }
      
      let privateKey = privateKeyRaw.trim();
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      credentials = {
        type: "service_account",
        project_id: "daikin-auction",
        private_key_id: "85c11ed5ea95ab0e473818e9f09ae0012bfa4aa5",
        private_key: privateKey,
        client_email: clientEmail,
        client_id: "101146336804974189368"
      };
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheetsInstance = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets instance created successfully');
    
    return sheetsInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error);
    throw error;
  }
};

const SHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1VYXpn0veIIQNUzNxwdFOgWwcMu-SufJ2rsFYoyEv4FM';

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
