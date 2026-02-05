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

export interface RewardsClaim {
  id?: string;
  client_name: string;
  gift_code: string;
  system_id: number;
  system_title: string;
  claimed_at: string;
  ticket_id: string;
}

export interface GiftCode {
  code: string;
  client_name: string;
  used: boolean;
}
