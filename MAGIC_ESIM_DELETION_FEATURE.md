# Magic eSIM Account Deletion Request Feature

This feature implements a web page for Magic eSIM users to request account deletion, satisfying Google Play's account deletion URL requirement.

## Overview

**Route**: `/esimmagic/user/request_delete`

The page allows users to submit account deletion requests without authentication. Requests are sent via email to the compliance team for processing.

## Architecture

### Frontend
- **Location**: `src/pages/MagicEsimAccountDeletion.tsx`
- **Framework**: React + TypeScript
- **Validation**: React Hook Form + Zod
- **UI**: shadcn-ui components
- **Features**:
  - Standalone page (no header/footer)
  - Email and reason fields (both required)
  - Client-side validation
  - Inline success/error messages
  - No authentication required

### Backend
- **Type**: Supabase Edge Function (Deno)
- **Location**: `supabase/functions/request-account-deletion/`
- **Features**:
  - Email sending via Brevo (Sendinblue) API
  - Rate limiting: 5 requests per hour per IP address
  - Server-side validation
  - CORS enabled for frontend access
  - Captures: email, reason, timestamp, IP address, user agent

## Deployment

### 1. Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Active Supabase project
- Brevo (Sendinblue) account with API key

### 2. Configure Environment Variables

Set the following secrets in your Supabase project:

```bash
# Using Supabase CLI
supabase secrets set BREVO_API_KEY=your-brevo-api-key
supabase secrets set BREVO_SENDER_EMAIL=noreply@sannex.ng
supabase secrets set BREVO_SENDER_NAME="SANNEX Compliance"
```

Or via Supabase Dashboard:
1. Go to Project Settings > Functions > Secrets
2. Add the three environment variables listed above

### 3. Deploy Edge Function

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy request-account-deletion
```

### 4. Update Frontend Configuration

Ensure your production `.env` file has the correct Supabase URL:

```env
VITE_SUPABASE_DATABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Deploy Frontend

Deploy the frontend application to your hosting platform (e.g., Vercel, Netlify, Lovable):

```bash
npm run build
# Then deploy the dist folder to your hosting platform
```

## Testing

### Test Form Validation

1. Navigate to `/esimmagic/user/request_delete`
2. Try submitting empty form - should show validation errors
3. Enter invalid email - should show email format error
4. Enter reason less than 10 characters - should show length error

### Test Successful Submission

1. Fill in valid email and detailed reason
2. Click "Request Deletion"
3. Should see success message: "Thanks. Your account will be deactivated and your data will be deleted entirely from our database within 30 days."
4. Check compliance@sannex.ng for email notification

### Test Rate Limiting

1. Submit 5 requests from the same IP address
2. 6th request should be blocked with rate limit error
3. Error message should indicate how long to wait

### Test Edge Function Directly

Using curl:

```bash
curl -X POST \
  https://your-project-ref.supabase.co/functions/v1/request-account-deletion \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "reason": "Testing the account deletion request flow"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thanks. Your account will be deactivated and your data will be deleted entirely from our database within 30 days."
}
```

## Email Template

The email sent to compliance@sannex.ng includes:

- **Subject**: Magic eSIM — Account Deletion Request
- **Body**:
  ```
  Magic eSIM Account Deletion Request

  User Email: [user's email]
  Reason for Deletion: [user's reason]
  Timestamp (UTC): [ISO timestamp]
  IP Address: [user's IP]
  User Agent: [user's browser info]
  ```

## Security Features

1. **Rate Limiting**: Prevents abuse with 5 requests per hour per IP
2. **Input Validation**: Both client-side and server-side validation
3. **CORS Configuration**: Restricts API access
4. **No Data Storage**: Emails are sent directly, no database storage
5. **IP & User Agent Logging**: For audit trail purposes

## Maintenance

### Updating Rate Limit

To change the rate limit, edit `supabase/functions/request-account-deletion/index.ts`:

```typescript
// Change this line:
if (entry.count >= 5) { // Change 5 to your desired limit
```

### Updating Email Content

Edit the email body in the `sendEmailViaBrevo` function in `supabase/functions/request-account-deletion/index.ts`.

### Monitoring

Check Supabase function logs for:
- Failed email sends
- Rate limit triggers
- Validation errors

```bash
supabase functions logs request-account-deletion
```

## Troubleshooting

### "Configuration error" message
- Check that `VITE_SUPABASE_DATABASE_URL` is set correctly in your environment

### "Failed to send email" in logs
- Verify `BREVO_API_KEY` is correct
- Check Brevo API limits haven't been exceeded
- Verify sender email is verified in Brevo

### "Rate limit exceeded" for legitimate users
- Rate limits are per IP, shared networks may hit limits faster
- Consider increasing the limit or implementing user-based limiting

### Edge function not found (404)
- Ensure function is deployed: `supabase functions list`
- Check function name matches exactly: `request-account-deletion`
- Verify project is linked: `supabase link --project-ref your-ref`

## Compliance Notes

This implementation satisfies Google Play's requirement for account deletion URLs:
- ✅ Provides a dedicated deletion request page
- ✅ Accessible without login
- ✅ Collects minimal required information
- ✅ Provides clear confirmation message
- ✅ States 30-day processing timeline
- ✅ No redirect (inline confirmation)

The compliance team at compliance@sannex.ng is responsible for:
1. Processing deletion requests within 30 days
2. Deactivating user accounts
3. Permanently deleting user data from the database
4. Confirming completion to the user

## Files Modified

- `src/pages/MagicEsimAccountDeletion.tsx` - New form component
- `src/App.tsx` - Added route for the deletion page
- `src/components/LanguageSelectionModal.tsx` - Excluded `/esimmagic` from redirects
- `.env.example` - Added Brevo configuration
- `supabase/functions/request-account-deletion/index.ts` - Edge function
- `supabase/functions/request-account-deletion/README.md` - Function documentation

## Support

For issues or questions:
- **Email**: info@sannex.ng
- **Phone**: +2347048706198
