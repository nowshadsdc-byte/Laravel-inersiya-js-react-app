export interface Lead {
    name: string;
    email: string | null;
    phone: string | null;
    whatsapp_number: string | null;

    status_id: number;
    source_id: number | null;

    assigned_to: number | null;

    town: string | null;
    address: string | null;

    created_at?: string;
    updated_at?: string;
}

// Types
export interface LeadStatus {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface LeadSource {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface LeadProfile {
  id: number
  lead_id: number
  occupation: string
  company: string
  interest: string
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: number
  lead_id: number
  user_id: number
  note: string
  created_at: string
  updated_at: string
}

export interface LeadCall {
  id: number
  lead_id: number
  user_id: number
  called_at: string
  result: string
  remarks: string
  created_at: string
  updated_at: string
}

export interface LeadReminder {
  id: number
  lead_id: number
  user_id: number
  remind_at: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  whatsapp_number: string
  status_id: number
  source_id: number
  assigned_to: number
  town: string
  address: string
  created_at: string
  updated_at: string
  // Relations
  status?: LeadStatus
  source?: LeadSource
  profile?: LeadProfile
  notes?: LeadNote[]
  calls?: LeadCall[]
  reminders?: LeadReminder[]
}

export interface User {
  id: number
  name: string
  email: string
}

type SortDirection = "asc" | "desc" | null
type SortField = "status" | "source" | "assignedUser" | "occupation" | "company" | "interest"

interface ColumnVisibility {
  id: boolean
  name: boolean
  email: boolean
  phone: boolean
  whatsapp: boolean
  status: boolean
  source: boolean
  assignedTo: boolean
  town: boolean
  address: boolean
  occupation: boolean
  company: boolean
  interest: boolean
  createdAt: boolean
  updatedAt: boolean
  notes: boolean
  calls: boolean
  reminders: boolean
}

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Proposal Sent": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  Lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}