-- SANNEX 2025 Top Clients Rewards System
-- Database Schema and Initial Data

-- ==========================================
-- Table: rewards_access_codes
-- Stores gift codes for VIP clients
-- ==========================================
CREATE TABLE IF NOT EXISTS rewards_access_codes (
  code TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Table: rewards_claims
-- Tracks claimed automation systems
-- ==========================================
CREATE TABLE IF NOT EXISTS rewards_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  gift_code TEXT NOT NULL,
  system_id INTEGER NOT NULL,
  system_title TEXT NOT NULL,
  ticket_id TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE rewards_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_access_codes ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read claims (for live feed)
CREATE POLICY "Anyone can view claims" ON rewards_claims
  FOR SELECT USING (true);

-- Policy to allow inserts
CREATE POLICY "Anyone can insert claims" ON rewards_claims
  FOR INSERT WITH CHECK (true);

-- Policy to allow reading access codes for validation
CREATE POLICY "Anyone can view access codes" ON rewards_access_codes
  FOR SELECT USING (true);

-- Policy to allow updating access codes (marking as used)
CREATE POLICY "Anyone can update access codes" ON rewards_access_codes
  FOR UPDATE USING (true);

-- ==========================================
-- Initial Data: All 21 Top Clients from CSV
-- ==========================================
INSERT INTO rewards_access_codes (code, client_name, email, used) VALUES
  ('SANNEX2025GIFT01', 'Dwight Oni', 'dwight.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT02', 'Ngozi', 'ngozi.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT03', 'Gideon Momoh', 'gideon.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT04', 'Adedoyin', 'adedoyin.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT05', 'Franklin', 'franklin.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT06', 'Salahudin', 'salahudin.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT07', 'Oromidayo', 'oromidayo.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT08', 'Joseph Enesu', 'joseph.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT09', 'Yassin', 'yassin.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT10', 'Samuel Moses', 'samuel.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT11', 'Sanmi Ìdòwú', 'sanmi.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT12', 'Fash', 'fash.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT13', 'Seyi Cole', 'seyi.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT14', 'Fope', 'fope.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT15', 'Mrs. Omolara', 'omolara.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT16', 'Lamborghini', 'lamborghini.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT17', 'Daniel', 'daniel.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT18', 'Mrs. Motunrayo', 'motunrayo.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT19', 'Rocco', 'rocco.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT20', 'Babatunde', 'babatunde.tc@sannex.ng', FALSE),
  ('SANNEX2025GIFT21', 'Mr. Lawal', 'lawal.tc@sannex.ng', FALSE)
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- Verification Queries
-- ==========================================

-- Check all gift codes are loaded
-- SELECT COUNT(*) as total_codes FROM rewards_access_codes;
-- Expected: 21

-- Check unused codes
-- SELECT COUNT(*) as unused_codes FROM rewards_access_codes WHERE used = FALSE;
-- Expected: 21 (initially)

-- View all codes
-- SELECT code, client_name, email, used FROM rewards_access_codes ORDER BY code;

-- Check claims
-- SELECT COUNT(*) as total_claims FROM rewards_claims;
-- Expected: 0 (initially)

-- View all claims with details
-- SELECT 
--   c.client_name, 
--   c.gift_code, 
--   c.system_title, 
--   c.ticket_id,
--   c.claimed_at
-- FROM rewards_claims c
-- ORDER BY c.claimed_at DESC;
