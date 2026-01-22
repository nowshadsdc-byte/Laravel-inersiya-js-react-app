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

// Mock Data
export const leadStatuses: LeadStatus[] = [
  { id: 1, name: "OLD", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 2, name: "OLD", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 3, name: "OLD", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 4, name: "Proposal Sent", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 5, name: "Negotiation", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 6, name: "Won", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 7, name: "Lost", created_at: "2025-01-01", updated_at: "2025-01-01" },
]

export const leadSources: LeadSource[] = [
  { id: 1, name: "Website", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 2, name: "Referral", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 3, name: "Social Media", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 4, name: "Cold Call", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 5, name: "Email Campaign", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 6, name: "Trade Show", created_at: "2025-01-01", updated_at: "2025-01-01" },
  { id: 7, name: "Advertisement", created_at: "2025-01-01", updated_at: "2025-01-01" },
]

export const users: User[] = [
  { id: 1, name: "Nowshad", email: "nowshad@company.com" },
  { id: 2, name: "Nowshad", email: "sarah@company.com" },
  { id: 3, name: "Mike Davis", email: "mike@company.com" },
  { id: 4, name: "Emily Brown", email: "emily@company.com" },
  { id: 5, name: "David Wilson", email: "david@company.com" },
]

const towns = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]
const occupations = ["Engineer", "Manager", "Developer", "Designer", "Analyst", "Consultant", "Director", "Executive", "Specialist", "Coordinator"]
const companies = ["TechCorp", "InnovateLabs", "GlobalSoft", "DataDrive", "CloudNet", "DigitalWave", "SmartSystems", "FutureTech", "WebWorks", "AppVentures"]
const interests = ["Enterprise Software", "Cloud Services", "Data Analytics", "Mobile Apps", "Web Development", "AI/ML Solutions", "Cybersecurity", "IoT Platforms", "E-commerce", "SaaS Products"]
const callResults = ["Interested", "Not Interested", "Follow Up", "No Answer", "Wrong Number", "Busy", "Callback Requested"]

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

function generateLeads(count: number): Lead[] {
  const leads: Lead[] = []
  const startDate = new Date("2024-01-01")
  const endDate = new Date("2025-01-21")

  for (let i = 1; i <= count; i++) {
    const statusId = Math.floor(Math.random() * 7) + 1
    const sourceId = Math.floor(Math.random() * 7) + 1
    const assignedTo = Math.floor(Math.random() * 5) + 1
    const createdAt = randomDate(startDate, endDate)

    const lead: Lead = {
      id: i,
      name: `Lead ${i} - ${["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"][i % 10]} ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"][Math.floor(i / 10) % 10]}`,
      email: `lead${i}@${["gmail.com", "yahoo.com", "outlook.com", "company.com", "business.net"][i % 5]}`,
      phone: `+1-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      whatsapp_number: `+1-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      status_id: statusId,
      source_id: sourceId,
      assigned_to: assignedTo,
      town: towns[i % towns.length],
      address: `${Math.floor(Math.random() * 9999) + 1} ${["Main St", "Oak Ave", "Pine Rd", "Elm Blvd", "Cedar Ln"][i % 5]}, ${towns[i % towns.length]}`,
      created_at: createdAt,
      updated_at: randomDate(new Date(createdAt), endDate),
      status: leadStatuses.find((s) => s.id === statusId),
      source: leadSources.find((s) => s.id === sourceId),
      profile: {
        id: i,
        lead_id: i,
        occupation: occupations[i % occupations.length],
        company: companies[i % companies.length],
        interest: interests[i % interests.length],
        created_at: createdAt,
        updated_at: createdAt,
      },
      notes: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: i * 100 + j,
        lead_id: i,
        user_id: Math.floor(Math.random() * 5) + 1,
        note: `Note ${j + 1} for lead ${i}: ${["Initial contact made", "Follow up required", "Waiting for response", "Meeting scheduled", "Documents sent"][j % 5]}`,
        created_at: randomDate(new Date(createdAt), endDate),
        updated_at: randomDate(new Date(createdAt), endDate),
      })),
      calls: Array.from({ length: Math.floor(Math.random() * 4) }, (_, j) => ({
        id: i * 100 + j,
        lead_id: i,
        user_id: Math.floor(Math.random() * 5) + 1,
        called_at: randomDate(new Date(createdAt), endDate),
        result: callResults[Math.floor(Math.random() * callResults.length)],
        remarks: `Call ${j + 1}: ${["Discussed requirements", "Left voicemail", "Scheduled callback", "Sent follow-up email", "Answered questions"][j % 5]}`,
        created_at: randomDate(new Date(createdAt), endDate),
        updated_at: randomDate(new Date(createdAt), endDate),
      })),
      reminders: Array.from({ length: Math.floor(Math.random() * 2) }, (_, j) => ({
        id: i * 100 + j,
        lead_id: i,
        user_id: assignedTo,
        remind_at: randomDate(new Date(), new Date("2025-03-01")),
        is_completed: Math.random() > 0.5,
        created_at: randomDate(new Date(createdAt), endDate),
        updated_at: randomDate(new Date(createdAt), endDate),
      })),
    }
    leads.push(lead)
  }
  return leads
}

export const leads = generateLeads(500)
