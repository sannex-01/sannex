export interface AutomationSystem {
  id: number;
  title: string;
  worth: string;
  worthMin: number;
  worthMax: number;
  description: string;
  tags: string[];
  status: 'available' | 'claimed';
  claimedBy?: string;
  claimedAt?: string;
}

export interface DraftClaim {
  id?: string;
  client_name: string;
  access_code: string;
  system_id: number;
  system_title: string;
  claimed_at: string;
  ticket_id: string;
}

export interface AccessCode {
  code: string;
  client_name: string;
  email?: string;
  used: boolean;
}
