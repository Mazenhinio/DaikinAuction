# Daikin Auction POC

A minimal, production-ready POC for a private Daikin VRV stock auction built with Next.js 14, TypeScript, and Google Sheets integration.

## Features

- **User Registration**: Signed HTTP-only cookie authentication (no database)
- **Gated Access**: Download catalogues and submit bids after registration
- **Google Sheets Logging**: All events logged to one spreadsheet with 3 tabs
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Real-time Countdown**: Auction timer with live updates

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Google Sheets API
- JWT for sessions
- Sonner for toast notifications

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# JWT Secret for session cookies
JWT_SECRET=your_32_character_random_string_here
```

## Google Sheets Setup

1. **Create a Google Spreadsheet** with these exact tab names:
   - `Registrations`
   - `Downloads` 
   - `Bids`

2. **Set up a Service Account**:
   - Go to Google Cloud Console
   - Create a new project or use existing
   - Enable Google Sheets API
   - Create a Service Account
   - Download the JSON credentials file
   - Extract `client_email` and `private_key` for your `.env`

3. **Share the Spreadsheet**:
   - Share your spreadsheet with the service account email
   - Grant "Editor" permissions

## Column Headers

The app expects these exact column headers in your Google Sheets:

### Registrations Tab
`Timestamp | UserId | FullName | CompanyName | Email | Phone | Country | Interests | IP | UserAgent`

### Downloads Tab  
`Timestamp | UserId | Email | CatalogueSlug | CatalogueTitle | IP | UserAgent`

### Bids Tab
`Timestamp | UserId | Email | BundleSlug | Notes | IP | UserAgent`

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Deployment

This app is ready for deployment on:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

Set the environment variables in your hosting platform's dashboard.

## Project Structure

```
app/
  page.tsx                 # Landing page
  access/page.tsx          # Gated registration/dashboard
  api/register/route.ts    # Registration endpoint
  api/track/download/route.ts # Download tracking
  api/bids/route.ts        # Bid submission
components/
  RegistrationForm.tsx     # User registration form
  CatalogueCards.tsx       # Product catalogue cards
  BidForm.tsx             # Bid submission form
  CountdownTimer.tsx      # Auction countdown
lib/
  auth.ts                 # JWT session management
  sheets.ts               # Google Sheets integration
  catalogues.ts           # Product catalogue data
types/
  events.ts              # TypeScript definitions
```

## Usage

1. **Landing Page**: Visit `/` to see auction info and countdown
2. **Registration**: Click "Register for Access" to create account
3. **Access Portal**: After registration, access `/access` for catalogues and bidding
4. **Download Tracking**: All catalogue downloads are logged to Google Sheets
5. **Bid Submission**: Submit bids for different product bundles

## Customization

### Product Catalogues
Edit `lib/catalogues.ts` to modify available catalogues and their download URLs.

### Auction End Date
Modify the date in `components/CountdownTimer.tsx` to set your auction deadline.

### Bundle Types
Update bundle options in `components/BidForm.tsx` and the TypeScript types.

## Security Notes

- Sessions use HTTP-only cookies with secure flags in production
- JWT tokens expire after 30 days
- All API routes validate authentication
- Input validation using Zod schemas
- CSRF protection through SameSite cookie settings

## Analytics & Monitoring

All events are logged to console with structured data:
- Registration events
- Catalogue download tracking  
- Bid submissions

## Support

For questions about setup or customization, refer to the API documentation in the route files or check the component implementations.
