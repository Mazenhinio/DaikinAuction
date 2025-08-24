# Quick Setup Guide for Daikin Auction POC

## 1. Environment Setup

Create a `.env` file in the root directory:

```bash
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your_32_character_random_string_here
```

## 2. Google Sheets Setup

1. Create a Google Spreadsheet with these tabs:
   - `Registrations` 
   - `Downloads`
   - `Bids`

2. Add these column headers to each tab:

**Registrations:**
```
Timestamp | UserId | FullName | CompanyName | Email | Phone | Country | Interests | IP | UserAgent
```

**Downloads:**
```
Timestamp | UserId | Email | CatalogueSlug | CatalogueTitle | IP | UserAgent
```

**Bids:**
```
Timestamp | UserId | Email | BundleSlug | Notes | IP | UserAgent
```

3. Share the spreadsheet with your service account email (Editor access)

## 3. Run the Project

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see your auction site!

## 4. Testing the Flow

1. Visit the homepage
2. Click "Register for Access" 
3. Fill out the registration form
4. After registration, you'll see the dashboard with:
   - Product catalogues (downloadable)
   - Bid submission form
5. All actions are logged to your Google Sheet

## 5. Production Deployment

The project is ready for deployment on Vercel, Netlify, or any Node.js hosting platform. Just set the environment variables in your hosting platform's dashboard.
