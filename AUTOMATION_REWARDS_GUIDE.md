# SANNEX 2025 Automation Rewards - Implementation Guide

## Overview

The SANNEX Automation Rewards is a premium experience for 2025 top clients to select one automation system from a curated list of 20 systems. Each client receives a unique gift code via the CSV file stored in `public/top-clients-2025.csv`.

## Features Implemented

### 1. Hero Scene - "VIP Rewards Night"
- Dark premium gradient background (gray-900 → purple-900 → black)
- Animated grid background with floating effect
- Glowing SANNEX emblem with sparkles
- Typewriter animation for copy:
  - "2025 Top Clients Only"
  - "One pick each."
  - "20 automation systems. Limited slots."
  - "First come, first claimed."
- Live UI elements:
  - 🔥 Slots remaining counter (X/20)
  - 🟢 "Rewards are live" indicator
  - 👀 Current viewers count

### 2. Gift Code System
- Physical key-like code entry experience
- Light beam scan animation effect
- Success: "ACCESS GRANTED" with vault door animation
- Failure: Custom error message
- Personalized welcome: "Welcome, [Client Name]"
- Codes loaded from CSV: SANNEX2025GIFT01 through SANNEX2025GIFT20

### 3. The Vault - System Cards
- 20 automation systems displayed in responsive grid
- Each card shows:
  - System title
  - Worth range ($X,XXX - $X,XXX)
  - Description
  - Tags (Revenue / Ops / Marketing / Personal / Travel)
  - Status: Available (green) or Claimed (red/gray)
  - If claimed: Shows "Claimed by [Name]"
- Micro-animations: Subtle hover effects and transitions
- Cards float in with staggered delay animation

### 4. Live Claim Feed
- Side panel showing recent claims in real-time
- Format: "✅ [Name] claimed: [System]"
- Auto-refreshes every 15 seconds
- Creates urgency without explicit "hurry" messages

### 5. "Pick One" Selection Mechanic
- **Step A: Lock-In Preview Modal**
  - Shows selected system details
  - Mini animated pipeline preview: Trigger → Automation → Outcome
  - Warning: "⚠️ Once you lock this in, you can't pick another."
  - 5-minute reservation timer (prevents others from claiming)
  - Buttons: "LOCK IN MY PICK" (primary) | "Back" (secondary)

- **Step B: 10-Second Countdown**
  - Cinematic countdown: 10...9...8...
  - "Confirming claim..." message
  - Animated spinner
  - Prevents accidental selections

### 6. VIP Ticket/Certificate
- Personalized claim ticket displayed
- Shows:
  - Ticket ID: SANNEX-VIP-####
  - Client name
  - Selected system with full description
  - Build window: 1-2 weeks
  - Free run: 4 weeks
  - Ops sponsored by: SANNEX TECH LTD ✅
- Action buttons:
  - "Book Kickoff Call" (Calendly/WhatsApp)
  - "Download Certificate" (PDF)
- Account locked message: "🔒 You already claimed your one pick."

### 7. Rewards Board (Wall of Fame)
- Public-facing page at `/rewards/board`
- Shows all 20 systems with claim status
- Progress bar: Claimed X/20
- Color-coded status badges
- Can be embedded or linked externally
- CTA button: "Enter VIP Rewards" for those with codes

### 8. Extra Features
- **5-Minute Reservation**: System is held for 5 minutes during selection
- **VIP Badge Animations**: Gold shimmer effect on claimed systems
- **Easter Egg**: Fun message if trying to claim again: "😂 Omo, one pick only. Your slot is locked."
- **CSV Integration**: Reads client data and gift codes from public/top-clients-2025.csv

## Access URLs

- **Main Rewards Entry**: `/rewards` or `/rewards/2025`
- **Public Rewards Board**: `/rewards/board`

## CSV Data Structure

The system reads from `/public/top-clients-2025.csv` with the following columns:

```csv
email,phone,client_name,join_date,total_amount_spent,percentage_contribution,project_name,project_description,project_status,surprise_date,gift_code
```

### Example Gift Codes

All 20 top clients have gift codes in the format:
- `SANNEX2025GIFT01` → Dwight Oni
- `SANNEX2025GIFT02` → Ngozi
- `SANNEX2025GIFT03` → Gideon Momoh
- ... and so on through GIFT20

## Database Setup (Supabase) - Optional

If you want to use Supabase for persistence instead of CSV:

### Required Tables

#### 1. rewards_access_codes
```sql
CREATE TABLE rewards_access_codes (
  code TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Load from CSV (example)
INSERT INTO rewards_access_codes (code, client_name, email, used) VALUES
  ('SANNEX2025GIFT01', 'Dwight Oni', 'dwight.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT02', 'Ngozi', 'ngozi.tc@sannex.ng', FALSE);
  -- ... continue for all 20 clients
```

#### 2. rewards_claims
```sql
CREATE TABLE rewards_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  gift_code TEXT NOT NULL,
  system_id INTEGER NOT NULL,
  system_title TEXT NOT NULL,
  ticket_id TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE rewards_claims ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read claims (for live feed)
CREATE POLICY "Anyone can view claims" ON rewards_claims
  FOR SELECT USING (true);

-- Policy to allow inserts
CREATE POLICY "Anyone can insert claims" ON rewards_claims
  FOR INSERT WITH CHECK (true);
```

### Environment Variables

Add these to your `.env` file (or Netlify/Vercel environment variables):

```env
VITE_SUPABASE_DATABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## The 20 Automation Systems

1. **Lead Capture & Conversion Engine** ($2,500-$5,000) - Revenue, Marketing
2. **AI Sales Follow-Up Accelerator** ($3,000-$6,000) - Revenue, Marketing
3. **Client Onboarding Automation Suite** ($2,000-$4,500) - Ops, Revenue
4. **E-commerce Smart Fulfillment System** ($3,000-$6,500) - Ops, Revenue
5. **Abandoned Cart Recovery Engine** ($1,500-$3,500) - Revenue, Marketing
6. **Subscription & Renewal Automation** ($2,500-$5,000) - Revenue, Ops
7. **Customer Support Smart Router** ($2,000-$4,500) - Ops
8. **Executive AI Productivity Assistant** ($4,000-$8,000) - Personal, Ops
9. **Revenue & Financial Intelligence Dashboard** ($3,000-$6,000) - Revenue
10. **Recruitment & Smart Hiring Pipeline** ($2,000-$4,000) - Ops
11. **Referral & Ambassador Tracking System** ($1,500-$3,500) - Revenue, Marketing
12. **Vendor & Supplier Management** ($2,500-$5,000) - Ops
13. **Travel & Booking Experience Workflow** ($2,000-$4,500) - Travel, Ops
14. **Professional Practice Automation** ($2,500-$6,000) - Ops, Revenue
15. **Social Media Content Repurposing Engine** ($1,500-$3,500) - Marketing
16. **Influencer / Creator Deal Management** ($2,000-$5,000) - Revenue, Marketing
17. **Event & Ticket Automation Platform** ($2,500-$5,000) - Ops, Revenue
18. **Compliance & Document Expiry Monitor** ($3,000-$6,000) - Ops
19. **Inventory & Low-Stock Smart Alert** ($2,000-$4,000) - Ops
20. **Reputation & Review Automation Engine** ($1,500-$3,500) - Marketing, Revenue

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **Data Source**: CSV file (`/public/top-clients-2025.csv`)
- **Backend (Optional)**: Supabase (PostgreSQL)
- **Animations**: CSS transitions + React state
- **Icons**: Lucide React
- **Notifications**: Sonner (toast library)

## User Flow

```
1. Visit /rewards
   ↓
2. Hero Page (animated, with live stats)
   ↓
3. Click "Enter Rewards"
   ↓
4. Enter Gift Code (from CSV)
   ↓
5. Code Validation ("ACCESS GRANTED")
   ↓
6. Vault Opens (20 cards appear)
   ↓
7. Browse systems + view live claim feed
   ↓
8. Select ONE system (5-min reservation starts)
   ↓
9. Lock-In Preview (review + warning)
   ↓
10. Click "LOCK IN MY PICK"
    ↓
11. 10-Second Countdown
    ↓
12. Claim Finalized + Ticket Issued
    ↓
13. Next Steps: Book Call or Download Certificate
```

## Deployment Checklist

- [x] CSV file in `/public/top-clients-2025.csv`
- [x] Gift codes format: SANNEX2025GIFT01-20
- [x] Client names match CSV
- [ ] Optional: Set up Supabase project
- [ ] Optional: Create database tables
- [ ] Optional: Add Supabase environment variables
- [ ] Deploy to Netlify/Vercel
- [ ] Test claim flow end-to-end with real codes
- [ ] Verify live feed updates correctly
- [ ] Test "already claimed" scenario
- [ ] Share `/rewards` link with VIP clients
- [ ] Monitor claims via `/rewards/board`

## Customization Options

### Modify System List
Edit `/src/data/automationSystems.ts` to add/remove/modify systems.

### Change Colors
Update Tailwind classes in component files:
- Hero: `bg-gradient-to-br from-gray-900 via-purple-900 to-black`
- Primary actions: `bg-gradient-to-r from-yellow-500 to-amber-600`
- Success: `text-green-400` / `bg-green-500`
- Warning: `text-yellow-400` / `bg-yellow-500`

### Adjust Timings
In `/src/pages/AutomationRewards.tsx`:
- Countdown: `setCountdown(10)` - change initial value
- Reservation timeout: `300000` (5 minutes in ms)
- Typewriter speed: `delay: 50` in typeText function

## Support & Maintenance

### Check Current Claims
Visit `/rewards/board` to see real-time claim status.

### Reset a Claim (if needed with Supabase)
```sql
-- Mark code as unused again
UPDATE rewards_access_codes 
SET used = FALSE 
WHERE code = 'CODE-TO-RESET';

-- Delete the claim record
DELETE FROM rewards_claims 
WHERE gift_code = 'CODE-TO-RESET';
```

## Security Considerations

1. **Gift Codes**: Use unique codes from CSV
2. **Rate Limiting**: Consider adding rate limiting to prevent brute force
3. **Code Expiry**: Add `expires_at` column if needed
4. **RLS Policies**: Enable Row Level Security on Supabase tables (if using)
5. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### Issue: Rewards page redirects to home
**Solution**: Check that `/rewards` route is correctly configured in App.tsx

### Issue: Gift codes don't work
**Solution**: Verify CSV file is in `/public/top-clients-2025.csv` and has correct format

### Issue: Claims not appearing in live feed
**Solution**: Check browser console for errors. Verify CSV is loading correctly.

---

**Built by SANNEX Tech LTD** | 🎯 Rewarding the 2025 Top Clients
