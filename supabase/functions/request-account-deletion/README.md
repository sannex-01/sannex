# Magic eSIM Account Deletion Request - Edge Function

This directory contains the Supabase Edge Function for handling Magic eSIM account deletion requests.

## Purpose

This function processes account deletion requests by:
1. Validating the request data (email format and reason)
2. Implementing rate limiting (5 requests per hour per IP)
3. Sending an email notification to compliance@sannex.ng via Brevo (Sendinblue)
4. Including user information (email, reason, timestamp, IP, user agent) in the email

## Setup

### Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Supabase project created
- Brevo (Sendinblue) account with API key

### Environment Variables

Set these secrets in your Supabase project:

```bash
# Using Supabase CLI
supabase secrets set BREVO_API_KEY=your-brevo-api-key
supabase secrets set BREVO_SENDER_EMAIL=noreply@sannex.ng
supabase secrets set BREVO_SENDER_NAME="SANNEX Compliance"
```

Or set them via the Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to Functions > Secrets
3. Add the following secrets:
   - `BREVO_API_KEY`: Your Brevo API key
   - `BREVO_SENDER_EMAIL`: Email address for sending notifications (e.g., noreply@sannex.ng)
   - `BREVO_SENDER_NAME`: Name that appears as the sender (e.g., SANNEX Compliance)

### Deployment

Deploy the function using Supabase CLI:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy request-account-deletion
```

## API Endpoint

Once deployed, the function will be available at:
```
https://your-project-ref.supabase.co/functions/v1/request-account-deletion
```

## Testing

Test the function using curl:

```bash
curl -X POST \
  https://your-project-ref.supabase.co/functions/v1/request-account-deletion \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "reason": "Testing the account deletion request flow"
  }'
```

## Rate Limiting

The function implements in-memory rate limiting:
- **Limit**: 5 requests per hour per IP address
- **Reset**: Automatically resets after 1 hour
- **Response**: Returns HTTP 429 with remaining time when limit is exceeded

Note: The rate limit store is in-memory, so it will reset if the function cold-starts.

## Error Handling

The function returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid email format, missing fields, reason too short)
- `429`: Rate limit exceeded
- `500`: Internal server error

## Email Format

The email sent to compliance@sannex.ng includes:
- User Email
- Reason for Deletion
- Timestamp (UTC)
- IP Address
- User Agent

## Security Notes

- No authentication required (as per requirements)
- Rate limiting prevents abuse
- Server-side validation ensures data integrity
- IP addresses and user agents are logged for audit purposes
- CORS enabled for frontend access
