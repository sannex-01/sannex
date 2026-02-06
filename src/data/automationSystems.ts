import { AutomationSystem } from '@/types/automationRewards';

export const automationSystems: AutomationSystem[] = [
  {
    id: 1,
    title: 'Lead Capture & Conversion Engine',
    worth: '$2,500 – $5,000',
    worthMin: 2500,
    worthMax: 5000,
    description: 'Captures leads from website, WhatsApp, LinkedIn, Instagram → auto follow-ups → CRM sync → reminder loops → sales assignment.',
    tags: ['Revenue', 'Marketing'],
    status: 'available',
    pipeline: {
      trigger: 'Website Form',
      automation: 'Auto Follow-up',
      outcome: 'CRM Synced'
    }
  },
  {
    id: 2,
    title: 'AI Sales Follow-Up Accelerator',
    worth: '$3,000 – $6,000',
    worthMin: 3000,
    worthMax: 6000,
    description: 'Tracks prospects → detects inactivity → auto-generates smart follow-ups → escalates hot leads → weekly pipeline report.',
    tags: ['Revenue', 'Marketing'],
    status: 'available',
    pipeline: {
      trigger: 'Prospect Idle',
      automation: 'Smart Outreach',
      outcome: 'Lead Engaged'
    }
  },
  {
    id: 3,
    title: 'Client Onboarding Automation Suite',
    worth: '$2,000 – $4,500',
    worthMin: 2000,
    worthMax: 4500,
    description: 'Payment received → contract sent → welcome email → onboarding checklist → internal team assignment → kickoff reminders.',
    tags: ['Ops', 'Revenue'],
    status: 'available',
    pipeline: {
      trigger: 'Payment Received',
      automation: 'Send Contract',
      outcome: 'Client Onboarded'
    }
  },
  {
    id: 4,
    title: 'E-commerce Smart Fulfillment System',
    worth: '$3,000 – $6,500',
    worthMin: 3000,
    worthMax: 6500,
    description: 'Order received → inventory sync → vendor alert → invoice generation → shipping confirmation → accounting entry.',
    tags: ['Ops', 'Revenue'],
    status: 'available',
    pipeline: {
      trigger: 'Order Placed',
      automation: 'Inventory Sync',
      outcome: 'Shipped'
    }
  },
  {
    id: 5,
    title: 'Abandoned Cart Recovery Engine',
    worth: '$1,500 – $3,500',
    worthMin: 1500,
    worthMax: 3500,
    description: 'Detect cart drop → auto reminder (email/WhatsApp) → discount trigger → notify sales team for high-value carts.',
    tags: ['Revenue', 'Marketing'],
    status: 'available',
    pipeline: {
      trigger: 'Cart Abandoned',
      automation: 'Send Reminder',
      outcome: 'Sale Recovered'
    }
  },
  {
    id: 6,
    title: 'Subscription & Renewal Automation System',
    worth: '$2,500 – $5,000',
    worthMin: 2500,
    worthMax: 5000,
    description: 'Tracks expiring subscriptions → renewal reminders → auto invoices → churn risk alerts → payment follow-up logic.',
    tags: ['Revenue', 'Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Expiry Near',
      automation: 'Renewal Reminder',
      outcome: 'Subscription Renewed'
    }
  },
  {
    id: 7,
    title: 'Customer Support Smart Router',
    worth: '$2,000 – $4,500',
    worthMin: 2000,
    worthMax: 4500,
    description: 'Auto-categorizes emails → urgent escalation → ticket creation → response templates → weekly analytics summary.',
    tags: ['Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Email Received',
      automation: 'Categorize & Route',
      outcome: 'Ticket Created'
    }
  },
  {
    id: 8,
    title: 'Executive AI Productivity Assistant',
    worth: '$4,000 – $8,000',
    worthMin: 4000,
    worthMax: 8000,
    description: 'Email parsing → task extraction → calendar automation → meeting summaries → weekly executive digest.',
    tags: ['Personal', 'Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Email Parsed',
      automation: 'Extract Tasks',
      outcome: 'Calendar Updated'
    }
  },
  {
    id: 9,
    title: 'Revenue & Financial Intelligence Dashboard',
    worth: '$3,000 – $6,000',
    worthMin: 3000,
    worthMax: 6000,
    description: 'Connect Paystack/Stripe → auto categorize revenue → detect failed payments → weekly revenue report → cashflow insights.',
    tags: ['Revenue'],
    status: 'available',
    pipeline: {
      trigger: 'Transaction Detected',
      automation: 'Categorize Revenue',
      outcome: 'Report Generated'
    }
  },
  {
    id: 10,
    title: 'Recruitment & Smart Hiring Pipeline',
    worth: '$2,000 – $4,000',
    worthMin: 2000,
    worthMax: 4000,
    description: 'Application intake → CV scoring → interview scheduling → ranking system → hiring manager alerts.',
    tags: ['Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Application Submitted',
      automation: 'Score CV',
      outcome: 'Interview Scheduled'
    }
  },
  {
    id: 11,
    title: 'Referral & Ambassador Tracking System',
    worth: '$1,500 – $3,500',
    worthMin: 1500,
    worthMax: 3500,
    description: 'Tracks referrals → calculates commission → auto notifies referrers → payout reminder automation.',
    tags: ['Revenue', 'Marketing'],
    status: 'available',
    pipeline: {
      trigger: 'Referral Made',
      automation: 'Calculate Commission',
      outcome: 'Payout Notified'
    }
  },
  {
    id: 12,
    title: 'Vendor & Supplier Management Automation',
    worth: '$2,500 – $5,000',
    worthMin: 2500,
    worthMax: 5000,
    description: 'Purchase order triggers → restock alerts → supplier performance tracking → payment scheduling.',
    tags: ['Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Stock Low',
      automation: 'Alert Supplier',
      outcome: 'PO Created'
    }
  },
  {
    id: 13,
    title: 'Travel & Booking Experience Workflow',
    worth: '$2,000 – $4,500',
    worthMin: 2000,
    worthMax: 4500,
    description: 'Booking form → invoice → checklist → visa/travel reminders → pre-trip and post-trip automation.',
    tags: ['Travel', 'Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Booking Confirmed',
      automation: 'Send Checklist',
      outcome: 'Trip Prepared'
    }
  },
  {
    id: 14,
    title: 'Professional Practice Automation System',
    worth: '$2,500 – $6,000',
    worthMin: 2500,
    worthMax: 6000,
    description: 'Appointment booking → auto reminders → document request → payment trigger → review follow-up.',
    tags: ['Ops', 'Revenue'],
    status: 'available',
    pipeline: {
      trigger: 'Appointment Booked',
      automation: 'Send Reminders',
      outcome: 'Session Completed'
    }
  },
  {
    id: 15,
    title: 'Social Media Content Repurposing Engine',
    worth: '$1,500 – $3,500',
    worthMin: 1500,
    worthMax: 3500,
    description: 'Repurpose one post → distribute across platforms → auto schedule → track engagement → weekly performance summary.',
    tags: ['Marketing'],
    status: 'available',
    pipeline: {
      trigger: 'Content Created',
      automation: 'Repurpose & Schedule',
      outcome: 'Multi-Platform Posted'
    }
  },
  {
    id: 16,
    title: 'Influencer / Creator Deal Management System',
    worth: '$2,000 – $5,000',
    worthMin: 2000,
    worthMax: 5000,
    description: 'Brand inquiry → contract automation → invoice generation → campaign reminders → payment tracking.',
    tags: ['Revenue', 'Marketing'],
    status: 'available',
    pipeline: {
      trigger: 'Deal Inquiry',
      automation: 'Generate Contract',
      outcome: 'Campaign Tracked'
    }
  },
  {
    id: 17,
    title: 'Event & Ticket Automation Platform',
    worth: '$2,500 – $5,000',
    worthMin: 2500,
    worthMax: 5000,
    description: 'Ticket purchase → QR generation → reminder emails → check-in tracking → feedback collection.',
    tags: ['Ops', 'Revenue'],
    status: 'available',
    pipeline: {
      trigger: 'Ticket Purchased',
      automation: 'Generate QR',
      outcome: 'Event Attended'
    }
  },
  {
    id: 18,
    title: 'Compliance & Document Expiry Monitor',
    worth: '$3,000 – $6,000',
    worthMin: 3000,
    worthMax: 6000,
    description: 'Tracks license renewals, contracts, certifications → sends early alerts → prevents costly lapses.',
    tags: ['Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Expiry Approaching',
      automation: 'Send Alert',
      outcome: 'Compliance Maintained'
    }
  },
  {
    id: 19,
    title: 'Inventory & Low-Stock Smart Alert System',
    worth: '$2,000 – $4,000',
    worthMin: 2000,
    worthMax: 4000,
    description: 'Monitors stock levels → auto reorder alerts → supplier notification → reporting dashboard.',
    tags: ['Ops'],
    status: 'available',
    pipeline: {
      trigger: 'Stock Threshold',
      automation: 'Reorder Alert',
      outcome: 'Inventory Replenished'
    }
  },
  {
    id: 20,
    title: 'Reputation & Review Automation Engine',
    worth: '$1,500 – $3,500',
    worthMin: 1500,
    worthMax: 3500,
    description: 'After service → auto request review → monitor ratings → alert team on negative feedback → response suggestions.',
    tags: ['Marketing', 'Revenue'],
    status: 'available',
    pipeline: {
      trigger: 'Service Complete',
      automation: 'Request Review',
      outcome: 'Rating Received'
    }
  },
];
