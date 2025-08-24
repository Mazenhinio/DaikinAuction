import { google } from 'googleapis';

// Create a single, reusable sheets instance
let sheetsInstance: any = null;

const getSheets = () => {
  if (sheetsInstance) {
    console.log('REUSING existing Google Sheets instance');
    return sheetsInstance;
  }

  console.log('CREATING new Google Sheets instance from environment variables...');
  
  // Simple, direct approach - just replace \n and use as-is (like the JSON file)
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
  
  console.log('Environment check:', {
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    keyLength: privateKey.length,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID
  });

  // Use only the required JWT fields for GoogleAuth
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "daikin-auction",
      private_key_id: "f39e4eb1e2f0f6109323192aa0d5160afd662fc4",
      private_key: privateKey,
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: "116850139086533631153"
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsInstance = google.sheets({ version: 'v4', auth });
  console.log('Google Sheets instance created successfully');
  
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
