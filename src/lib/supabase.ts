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
