# Migration Summary: Supabase to Netlify for Account Deletion

## What Was Changed

### Account Deletion Feature (Magic eSIM)
- **Before**: Used Supabase Edge Function (Deno runtime)
- **After**: Uses Netlify Function (Node.js runtime)
- **Location**: `netlify/functions/request-account-deletion.js`
- **Frontend**: `src/pages/MagicEsimAccountDeletion.tsx` now calls `/.netlify/functions/request-account-deletion`

### Top Clients Feedback Feature
- **Status**: Unchanged - Still uses Supabase
- **Location**: `src/lib/supabase.ts` and `src/pages/TopClients.tsx`
- **Reason**: Per requirement, only account deletion was migrated to Netlify

## Key Changes Made

1. **Created Netlify Infrastructure**
   - `netlify.toml` - Configuration file
   - `netlify/functions/request-account-deletion.js` - Serverless function
   - `netlify/functions/README.md` - Documentation

2. **Updated Frontend**
   - `src/pages/MagicEsimAccountDeletion.tsx` - Changed endpoint from Supabase to Netlify

3. **Updated Documentation**
   - `MAGIC_ESIM_DELETION_FEATURE.md` - Updated deployment instructions
   - `.env.example` - Added Netlify function configuration notes

4. **Removed Supabase Edge Function**
   - Deleted `supabase/functions/request-account-deletion/` directory

5. **Kept Supabase Integration**
   - `@supabase/supabase-js` package remains in dependencies
   - `src/lib/supabase.ts` unchanged
   - Environment variables for Supabase still required for Top Clients feature

## Environment Variables

### For Netlify (set in Netlify dashboard)
```bash
BREVO_API_KEY=your-api-key
BREVO_SENDER_EMAIL=noreply@sannex.ng
BREVO_SENDER_NAME=SANNEX Compliance
```

### For Frontend (set in .env file)
```bash
VITE_SUPABASE_DATABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Testing Checklist

### Account Deletion (Netlify Function)
- [ ] Navigate to `/esimmagic/user/request_delete`
- [ ] Submit form with valid email and reason
- [ ] Verify success message appears
- [ ] Check that compliance@sannex.ng receives email
- [ ] Test rate limiting (5 requests per hour per IP)

### Top Clients Feedback (Supabase)
- [ ] Navigate to Top Clients page with valid year parameter
- [ ] Complete the feedback form
- [ ] Verify feedback is submitted successfully
- [ ] Check Supabase database for feedback entry

## Deployment

### Netlify Deployment
1. Connect repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy will automatically pick up `netlify.toml` configuration
4. Functions will be available at `/.netlify/functions/[function-name]`

### Supabase Configuration (for Top Clients)
1. Keep Supabase project active
2. Ensure `top_client_feedback` table exists
3. Keep frontend environment variables configured

## Benefits of Migration

1. **Simplified Stack**: Account deletion no longer requires Supabase Edge Functions
2. **Node.js Runtime**: Easier to maintain with standard Node.js ecosystem
3. **Netlify Integration**: Native support for serverless functions
4. **Clear Separation**: Account deletion is independent from data storage features

## Future Considerations

If you want to fully migrate away from Supabase in the future:
1. Create a Netlify Function for feedback submission
2. Choose a database solution (MongoDB, PostgreSQL, etc.)
3. Update `src/lib/supabase.ts` to use the new backend
4. Remove `@supabase/supabase-js` dependency
