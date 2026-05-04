/**
 * Types for waitlist functionality
 */

export interface WaitlistPayload {
  email: string
}

export interface WaitlistRecord {
  id: string
  email: string
  created_at: string
  source: string
}

export interface WaitlistApiResponse {
  success: boolean
  message: string
}

export interface WaitlistErrorResponse {
  success: false
  message: string
}

export interface WaitlistSuccessResponse {
  success: true
  message: string
}
