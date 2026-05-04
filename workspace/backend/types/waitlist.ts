/**
 * Waitlist Data Types
 * 
 * Shared types for waitlist signup feature
 */

export interface WaitlistPayload {
  email: string
}

export interface WaitlistEntry {
  id: string
  email: string
  created_at: string
  source: string
}

export interface WaitlistResponse {
  success: boolean
  message: string
}

export interface WaitlistErrorResponse {
  success: false
  message: string
}
