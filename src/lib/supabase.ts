import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Function to ensure the feedback table exists
export const ensureFeedbackTable = async () => {
  if (!supabase) return false;
  
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
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }
  
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
// SANNEX 2025 Rewards System for Top Clients
// ==========================================

export interface SystemReservation {
  clientFullName: string;
  giftCode: string;
  automationId: number;
  automationTitle: string;
  certificateCode: string;
}

export interface GiftCodeEntry {
  code: string;
  client_name: string;
  email?: string;
  used: boolean;
}

// Gift code verification with custom business logic
export const authenticateGiftCode = async (inputCode: string) => {
  // Load from CSV data if Supabase not configured
  if (!supabase) {
    const { fetchTopClient2025Data, findClientByGiftCode } = await import('@/utils/rewardsData');
    const clients = await fetchTopClient2025Data();
    const client = findClientByGiftCode(clients, inputCode);
    
    if (client) {
      return { authenticated: true, clientIdentity: client.client_name };
    }
    return { authenticated: false, reason: "That code doesn't belong to the 2025 rewards list." };
  }
  
  const sanitizedInput = inputCode.trim().toUpperCase();
  
  const { data: codeData } = await supabase
    .from('rewards_access_codes')
    .select('code, client_name, used')
    .eq('code', sanitizedInput)
    .limit(1);
  
  if (!codeData || codeData.length === 0) {
    return { authenticated: false, reason: "That code doesn't belong to the 2025 rewards list." };
  }
  
  const codeInfo = codeData[0];
  if (codeInfo.used) {
    return { authenticated: false, reason: "This gift code has already been redeemed." };
  }
  
  return { authenticated: true, clientIdentity: codeInfo.client_name };
};

// Retrieve all reservations for live activity feed
export const retrieveReservationHistory = async () => {
  if (!supabase) {
    // Return mock data for demo
    return [];
  }
  
  const { data: reservations } = await supabase
    .from('rewards_claims')
    .select('system_id, system_title, client_name, claimed_at')
    .order('claimed_at', { ascending: false})
    .limit(50);
  
  return reservations || [];
};

// Check if gift code has active reservation
export const scanForExistingReservation = async (inputCode: string) => {
  if (!supabase) {
    return { hasReservation: false };
  }
  
  const sanitizedInput = inputCode.trim().toUpperCase();
  
  const { data: foundReservation } = await supabase
    .from('rewards_claims')
    .select('*')
    .eq('gift_code', sanitizedInput)
    .limit(1);
  
  if (foundReservation && foundReservation.length > 0) {
    return { hasReservation: true, reservationDetails: foundReservation[0] };
  }
  
  return { hasReservation: false };
};

// Process and finalize system reservation
export const finalizeSystemReservation = async (reservationData: SystemReservation) => {
  if (!supabase) {
    // Mock success for demo
    return { 
      finalized: true, 
      confirmation: {
        ...reservationData,
        claimed_at: new Date().toISOString()
      }
    };
  }
  
  const codeToConsume = reservationData.giftCode.trim().toUpperCase();
  const timestamp = new Date().toISOString();
  
  // Transaction-like approach: consume code then record reservation
  const codeConsumption = await supabase
    .from('rewards_access_codes')
    .update({ used: true })
    .eq('code', codeToConsume)
    .eq('used', false);
  
  if (codeConsumption.error) {
    return { 
      finalized: false, 
      failureReason: 'Gift code validation failed - may already be in use' 
    };
  }
  
  const reservationEntry = await supabase
    .from('rewards_claims')
    .insert({
      client_name: reservationData.clientFullName,
      gift_code: codeToConsume,
      system_id: reservationData.automationId,
      system_title: reservationData.automationTitle,
      ticket_id: reservationData.certificateCode,
      claimed_at: timestamp,
    })
    .select()
    .single();
  
  if (reservationEntry.error) {
    // Rollback: unreserve the code
    await supabase
      .from('rewards_access_codes')
      .update({ used: false })
      .eq('code', codeToConsume);
    
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
