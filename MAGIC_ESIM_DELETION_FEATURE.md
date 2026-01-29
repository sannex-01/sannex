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
- **Type**: Netlify Function (Node.js)
- **Location**: `netlify/functions/request-account-deletion.js`
- **Features**:
  - Email sending via Brevo (Sendinblue) API
  - Rate limiting: 5 requests per hour per IP address
  - Server-side validation
  - CORS enabled for frontend access
  - Captures: email, reason, timestamp, IP address, user agent

## Deployment

### 1. Prerequisites
- Netlify account
- Repository connected to Netlify
- Brevo (Sendinblue) account with API key

### 2. Configure Environment Variables

Set the following environment variables in your Netlify dashboard (Site settings > Environment variables):

```bash
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@sannex.ng
BREVO_SENDER_NAME=SANNEX Compliance
```

### 3. Deploy to Netlify

Push your changes to your repository and Netlify will automatically build and deploy:

```bash
git add .
git commit -m "Deploy Magic eSIM deletion feature with Netlify"
git push
```

Or deploy manually:

```bash
npm run build
netlify deploy --prod
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

### Test Function Directly

Using curl (replace with your actual Netlify site URL):

```bash
curl -X POST \
  https://your-site.netlify.app/.netlify/functions/request-account-deletion \
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

To change the rate limit, edit `netlify/functions/request-account-deletion.js`:

```javascript
// Change this line:
if (entry.count >= 5) { // Change 5 to your desired limit
```

### Updating Email Content

Edit the email body in the `sendEmailViaBrevo` function in `netlify/functions/request-account-deletion.js`.

### Monitoring

Check Netlify function logs for:
- Failed email sends
- Rate limit triggers
- Validation errors

Go to: Netlify Dashboard > Functions > request-account-deletion > Function log

## Troubleshooting

### "Configuration error" message
- The configuration is now handled by Netlify, no need for environment variables in the frontend

### "Failed to send email" in logs
- Verify `BREVO_API_KEY` is correct in Netlify environment variables
- Check Brevo API limits haven't been exceeded
- Verify sender email is verified in Brevo

### "Rate limit exceeded" for legitimate users
- Rate limits are per IP, shared networks may hit limits faster
- Consider increasing the limit or implementing user-based limiting

### Function not found (404)
- Ensure the function is deployed by checking the Netlify dashboard
- Verify the function file is in the correct location: `netlify/functions/request-account-deletion.js`
- Check that `netlify.toml` is configured correctly

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

- `src/pages/MagicEsimAccountDeletion.tsx` - Updated to use Netlify function instead of Supabase Edge Function
- `netlify/functions/request-account-deletion.js` - New Netlify function (replaces Supabase Edge Function)
- `netlify.toml` - Netlify configuration
- `.env.example` - Updated to reflect Netlify configuration for account deletion
- `package.json` - Kept Supabase dependency for Top Clients feedback feature

## Files Removed

- `supabase/functions/request-account-deletion/` directory (replaced by Netlify function)

## Note

The Top Clients feedback feature (`src/pages/TopClients.tsx` and `src/lib/supabase.ts`) continues to use Supabase for data storage. Only the Magic eSIM account deletion feature has been migrated to Netlify Functions.

## Support

For issues or questions:
- **Email**: info@sannex.ng
- **Phone**: +2347048706198
