import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { WaitlistPayload, WaitlistResponse, WaitlistErrorResponse } from '@/types/waitlist'

/**
 * POST /api/waitlist
 * 
 * Adds an email to the waitlist in Supabase.
 * 
 * Request body: { email: string }
 * 
 * Success (200):
 *   { success: true, message: "Email added to waitlist" }
 * 
 * Error (400):
 *   { success: false, message: "Please provide a valid email address" }
 * 
 * Error (405):
 *   { success: false, message: "Method not allowed" }
 * 
 * Error (500):
 *   { success: false, message: "Something went wrong. Please try again." }
 */

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  return EMAIL_REGEX.test(email)
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<WaitlistResponse | WaitlistErrorResponse>> {
  try {
    // Parse request body
    let body: WaitlistPayload
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON in request body',
        } as WaitlistErrorResponse,
        { status: 400 }
      )
    }

    const { email } = body

    // Server-side email validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid email address',
        } as WaitlistErrorResponse,
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Prepare payload for Supabase
    const payload = {
      email: normalizedEmail,
      created_at: new Date().toISOString(),
      source: 'landing_page',
    }

    // Upsert into Supabase (handle duplicates gracefully)
    // ON CONFLICT (email) DO NOTHING — if email exists, do nothing (no error)
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .upsert([payload], { onConflict: 'email' })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Something went wrong. Please try again.',
        } as WaitlistErrorResponse,
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Email added to waitlist',
      } as WaitlistResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/waitlist:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      } as WaitlistErrorResponse,
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET(): Promise<NextResponse<WaitlistErrorResponse>> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
    } as WaitlistErrorResponse,
    { status: 405 }
  )
}

export async function PUT(): Promise<NextResponse<WaitlistErrorResponse>> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
    } as WaitlistErrorResponse,
    { status: 405 }
  )
}

export async function DELETE(): Promise<NextResponse<WaitlistErrorResponse>> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
    } as WaitlistErrorResponse,
    { status: 405 }
  )
}

export async function PATCH(): Promise<NextResponse<WaitlistErrorResponse>> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
    } as WaitlistErrorResponse,
    { status: 405 }
  )
}
