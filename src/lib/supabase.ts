import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ... existing code ...
// Tipos para las entidades de la base de datos
export interface User {
  id: string
  name: string
  email: string
  timezone: string
  notification_settings: Record<string, any>
  calendar_preferences: Record<string, any>
  created_at: string
  updated_at?: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  due_at?: string
  priority: 0 | 1 | 2
  status: 'pending' | 'completed'
  reminders: number[]
  created_at: string
  updated_at?: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  start_at: string
  end_at: string
  event_type: string
  location?: string
  description?: string
  attendees: string[]
  created_at: string
  updated_at?: string
  source_meeting_request_id?: string
}

export interface MeetingRequest {
  id: string
  organizer_id: string
  title: string
  description?: string
  duration_minutes: number
  status: 'pending' | 'accepted' | 'declined'
  options: any[]
  attendees: string[]
  selected_option?: any
  selected_at?: string
  created_at: string
  updated_at?: string
}

export interface Contact {
  id: string
  user_id: string
  name: string
  email?: string
  phone?: string
  company?: string
  created_at: string
  updated_at?: string
}
