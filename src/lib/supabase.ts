import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to ensure the feedback table exists
export const ensureFeedbackTable = async () => {
  try {
    // Try to select from the table to check if it exists
    const { error } = await supabase
      .from('top_client_feedback')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, create it
      // Note: In production, you should create tables via Supabase dashboard or migrations
      // This is a simplified approach for initial setup
      console.log('Table does not exist. Please create it manually in Supabase dashboard with the following schema:');
      console.log(`
        CREATE TABLE IF NOT EXISTS top_client_feedback (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_email TEXT,
          client_phone TEXT,
          client_name TEXT,
          year TEXT,
          question1 TEXT NOT NULL,
          question2 TEXT NOT NULL,
          general_feedback TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking table existence:', error);
    return false;
  }
};

export interface FeedbackSubmission {
  client_email?: string;
  client_phone?: string;
  client_name?: string;
  year: string;
  question1: string;
  question2: string;
  general_feedback: string;
}

export const submitFeedback = async (feedback: FeedbackSubmission) => {
  try {
    const { data, error } = await supabase
      .from('top_client_feedback')
      .insert([feedback])
      .select();
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }
};

// ==========================================
// SANNEX 2025 VIP Draft System
// ==========================================

export interface SystemReservation {
  clientFullName: string;
  vipPasscode: string;
  automationId: number;
  automationTitle: string;
  certificateCode: string;
}

export interface PasscodeEntry {
  passcode: string;
  clientFullName: string;
  contactEmail?: string;
  isConsumed: boolean;
}

// Draft key verification with custom business logic
export const authenticateDraftKey = async (inputKey: string) => {
  const sanitizedInput = inputKey.trim().toUpperCase();
  
  const { data: keyData } = await supabase
    .from('draft_access_codes')
    .select('code, client_name, used')
    .eq('code', sanitizedInput)
    .limit(1);
  
  if (!keyData || keyData.length === 0) {
    return { authenticated: false, reason: "That code doesn't belong to the 2025 list." };
  }
  
  const keyInfo = keyData[0];
  if (keyInfo.used) {
    return { authenticated: false, reason: "This access key has already been claimed." };
  }
  
  return { authenticated: true, clientIdentity: keyInfo.client_name };
};

// Retrieve all reservations for live activity feed
export const retrieveReservationHistory = async () => {
  const { data: reservations } = await supabase
    .from('draft_claims')
    .select('system_id, system_title, client_name, claimed_at')
    .order('claimed_at', { ascending: false })
    .limit(50);
  
  return reservations || [];
};

// Check if passcode has active reservation
export const scanForExistingReservation = async (inputKey: string) => {
  const sanitizedInput = inputKey.trim().toUpperCase();
  
  const { data: foundReservation } = await supabase
    .from('draft_claims')
    .select('*')
    .eq('access_code', sanitizedInput)
    .limit(1);
  
  if (foundReservation && foundReservation.length > 0) {
    return { hasReservation: true, reservationDetails: foundReservation[0] };
  }
  
  return { hasReservation: false };
};

// Process and finalize system reservation
export const finalizeSystemReservation = async (reservationData: SystemReservation) => {
  const keyToConsume = reservationData.vipPasscode.trim().toUpperCase();
  const timestamp = new Date().toISOString();
  
  // Transaction-like approach: consume key then record reservation
  const keyConsumption = await supabase
    .from('draft_access_codes')
    .update({ used: true })
    .eq('code', keyToConsume)
    .eq('used', false);
  
  if (keyConsumption.error) {
    return { 
      finalized: false, 
      failureReason: 'Key validation failed - may already be in use' 
    };
  }
  
  const reservationEntry = await supabase
    .from('draft_claims')
    .insert({
      client_name: reservationData.clientFullName,
      access_code: keyToConsume,
      system_id: reservationData.automationId,
      system_title: reservationData.automationTitle,
      ticket_id: reservationData.certificateCode,
      claimed_at: timestamp,
    })
    .select()
    .single();
  
  if (reservationEntry.error) {
    // Rollback: unreserve the key
    await supabase
      .from('draft_access_codes')
      .update({ used: false })
      .eq('code', keyToConsume);
    
    return { 
      finalized: false, 
      failureReason: 'System reservation failed - please try again' 
    };
  }
  
  return { 
    finalized: true, 
    confirmation: reservationEntry.data 
  };
};

// SANNEX 2025 Draft - Claim Management
export interface DraftSystemClaim {
  client_name: string;
  access_code: string;
  system_id: number;
  system_title: string;
  ticket_id: string;
}

export interface VIPAccessKey {
  code: string;
  client_name: string;
  email?: string;
  used: boolean;
}

// Validate VIP access key for draft entry
export const validateVIPKey = async (keyInput: string) => {
  const normalizedKey = keyInput.toUpperCase();
  
  const { data: keyRecord, error: lookupError } = await supabase
    .from('draft_access_codes')
    .select('*')
    .eq('code', normalizedKey)
    .eq('used', false)
    .maybeSingle();
  
  if (lookupError || !keyRecord) {
    return { 
      isValid: false, 
      message: "That code doesn't belong to the 2025 list." 
    };
  }
  
  return { 
    isValid: true, 
    vipName: keyRecord.client_name 
  };
};

// Fetch all system claims for live feed
export const fetchAllSystemClaims = async () => {
  const { data: claimsList, error: fetchError } = await supabase
    .from('draft_claims')
    .select('*')
    .order('claimed_at', { ascending: false });
  
  return fetchError 
    ? { ok: false, message: fetchError.message, claims: [] }
    : { ok: true, claims: claimsList || [] };
};

// Verify if VIP key already has a claim
export const checkExistingClaim = async (keyInput: string) => {
  const normalizedKey = keyInput.toUpperCase();
  
  const { data: existingRecord, error: queryError } = await supabase
    .from('draft_claims')
    .select('*')
    .eq('access_code', normalizedKey)
    .maybeSingle();
  
  if (queryError && queryError.code !== 'PGRST116') {
    return { hasClaim: false, errorMsg: queryError.message };
  }
  
  return existingRecord 
    ? { hasClaim: true, claimData: existingRecord }
    : { hasClaim: false };
};

// Lock in VIP system selection
export const lockInSystemChoice = async (claimInfo: DraftSystemClaim) => {
  const normalizedKey = claimInfo.access_code.toUpperCase();
  
  // Mark key as consumed
  const { error: updateError } = await supabase
    .from('draft_access_codes')
    .update({ used: true })
    .eq('code', normalizedKey);
  
  if (updateError) {
    return { locked: false, message: updateError.message };
  }
  
  // Record the claim
  const { data: claimRecord, error: insertError } = await supabase
    .from('draft_claims')
    .insert([{
      ...claimInfo,
      claimed_at: new Date().toISOString(),
    }])
    .select()
    .single();
  
  return insertError
    ? { locked: false, message: insertError.message }
    : { locked: true, claimRecord };
};

// Draft Claim types and functions
export interface DraftClaimData {
  client_name: string;
  access_code: string;
  system_id: number;
  system_title: string;
  ticket_id: string;
}

export interface AccessCodeData {
  code: string;
  client_name: string;
  email?: string;
  used: boolean;
}

// Verify if access code is valid
export const verifyAccessCode = async (code: string): Promise<{ valid: boolean; clientName?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('draft_access_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('used', false)
      .single();
    
    if (error || !data) {
      return { valid: false, error: 'Invalid or already used access code' };
    }
    
    return { valid: true, clientName: data.client_name };
  } catch (error: any) {
    console.error('Error verifying access code:', error);
    return { valid: false, error: error.message };
  }
};

// Get all draft claims
export const getDraftClaims = async () => {
  try {
    const { data, error } = await supabase
      .from('draft_claims')
      .select('*')
      .order('claimed_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching claims:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// Check if code has already claimed
export const checkIfCodeClaimed = async (code: string) => {
  try {
    const { data, error } = await supabase
      .from('draft_claims')
      .select('*')
      .eq('access_code', code.toUpperCase())
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No claim found
      return { claimed: false };
    }
    
    if (error) {
      throw error;
    }
    
    return { claimed: true, claim: data };
  } catch (error: any) {
    console.error('Error checking claim:', error);
    return { claimed: false, error: error.message };
  }
};

// Submit a draft claim
export const submitDraftClaim = async (claim: DraftClaimData) => {
  try {
    // First, mark the access code as used
    const { error: codeError } = await supabase
      .from('draft_access_codes')
      .update({ used: true })
      .eq('code', claim.access_code.toUpperCase());
    
    if (codeError) {
      throw codeError;
    }
    
    // Then, insert the claim
    const { data, error } = await supabase
      .from('draft_claims')
      .insert([{
        ...claim,
        claimed_at: new Date().toISOString(),
      }])
      .select();
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error submitting claim:', error);
    return { success: false, error: error.message };
  }
};
