export interface TopClientData {
  email: string;
  phone: string;
  client_name: string;
  join_date: string;
  total_amount_spent: number;
  percentage_contribution: number;
  project_name: string;
  project_description: string;
  project_status: 'completed' | 'ongoing';
  surprise_date: string;
  gift_code: string;
}

export interface FeedbackFormData {
  question1: string;
  question2: string;
  generalFeedback: string;
}
