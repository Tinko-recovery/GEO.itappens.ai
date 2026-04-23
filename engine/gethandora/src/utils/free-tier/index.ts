import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'handora_free_trial'
const SECRET = process.env.COOKIE_SECRET || 'fallback-secret-for-dev'

function sign(value: string) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex')
}

export async function hasUsedFreeTrial() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)

  if (!cookie) return false

  const [value, signature] = cookie.value.split('.')
  if (!value || !signature) return true // Tampered

  return sign(value) === signature
}

export async function markFreeTrialUsed() {
  const cookieStore = await cookies()
  const value = 'used'
  const signature = sign(value)
  
  cookieStore.set(COOKIE_NAME, `${value}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/'
  })
}
