# Daikin VRV Auction Site

A production-ready Next.js auction platform for Daikin VRV equipment with Google Sheets integration, JWT authentication, and comprehensive form validation.

## Features

- 🎯 **Private Auction System** - Gated access with user registration
- 📊 **Google Sheets Integration** - All events logged to spreadsheet (Registrations, Downloads, Bids)
- 🎨 **Hero Image Integration** - Beautiful Daikin equipment showcase
- 🤖 **Chatbot Support** - Integrated Chatbase chatbot for user assistance
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔒 **Form Validation** - All form fields are required with proper validation
- ⏰ **Countdown Timer** - Real-time auction countdown
- 📋 **Interactive Bidding** - Visual product cards with bid submission
- 🌟 **Modern UI** - Electric/midnight blue theme matching Daikin branding

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Authentication:** JWT with HTTP-only cookies
- **Database:** Google Sheets (via Google Sheets API)
- **Deployment:** Vercel-ready

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Google Sheets Integration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key_here

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_here
```

## Google Service Account Setup

1. Create a Google Service Account
2. Generate a JSON key file
3. Share your Google Spreadsheet with the service account email
4. Either:
   - Place the JSON file in the project root as `daikin-auction-f39e4eb1e2f0.json`
   - OR use environment variables (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY)

## Google Spreadsheet Setup

Create a Google Spreadsheet with three tabs:
- **Registrations** - Headers: Timestamp, ID, Full Name, Company, Email, Phone, Country, Interests
- **Downloads** - Headers: Timestamp, User ID, Catalogue, Full Name, Company, Email
- **Bids** - Headers: Timestamp, User ID, Bundle, Bid Amount, Notes, Full Name, Company, Email

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `GOOGLE_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `JWT_SECRET`
3. Deploy automatically from main branch

### Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

- `GOOGLE_SPREADSHEET_ID`: Your Google Sheets spreadsheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email from your JSON file
- `GOOGLE_PRIVATE_KEY`: Private key from your JSON file (include -----BEGIN/END----- lines)
- `JWT_SECRET`: A secure random string for JWT signing

## Project Structure

```
├── app/                    # Next.js App Router
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── public/               # Static assets
│   ├── catalogues/       # PDF catalogue files
│   └── images/           # Product images
└── README.md
```

## Security Features

- JWT authentication with HTTP-only cookies
- Environment variables for sensitive data
- Input validation and sanitization
- CORS protection
- Secure Google Sheets API integration

## Contributing

This is a private auction platform. Please ensure all sensitive data remains secure and never commit environment files or service account keys.