# Netlify Functions

This directory contains serverless functions that run on Netlify.

## Functions

### request-account-deletion.js

Handles Magic eSIM account deletion requests.

**Endpoint**: `/.netlify/functions/request-account-deletion`

**Features**:
- Email validation
- Rate limiting (5 requests per hour per IP)
- Sends email notifications via Brevo API
- CORS enabled

**Environment Variables** (set in Netlify dashboard):
- `BREVO_API_KEY` - Your Brevo API key
- `BREVO_SENDER_EMAIL` - Sender email (e.g., noreply@sannex.ng)
- `BREVO_SENDER_NAME` - Sender name (e.g., SANNEX Compliance)

## Local Development

To test functions locally, install Netlify CLI:

```bash
npm install -g netlify-cli
```

Then run:

```bash
netlify dev
```

This will start a local development server with functions running at `http://localhost:8888/.netlify/functions/[function-name]`

## Deployment

Functions are automatically deployed when you push to your repository (if connected to Netlify) or when you run:

```bash
netlify deploy --prod
```

## Monitoring

View function logs in the Netlify dashboard:
1. Go to your site
2. Click on "Functions" in the sidebar
3. Select the function you want to monitor
4. View logs and invocation history

## Note on Top Clients Feedback

The Top Clients feedback feature continues to use Supabase for data storage. Only the Magic eSIM account deletion feature has been migrated to Netlify Functions.
