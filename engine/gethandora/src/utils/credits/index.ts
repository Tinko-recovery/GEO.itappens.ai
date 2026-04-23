import { createClient } from '@/utils/supabase/server'

/**
 * Calls the atomic PostgreSQL function to deduct a credit.
 * Returns true if successful, false if insufficient credits or expired.
 */
export async function useCredit(amount = 1) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('deduct_credits', {
    amount_to_deduct: amount
  })

  if (error) {
    console.error('Error deducting credits:', error.message)
    return false
  }

  return !!data
}

/**
 * Gets the current user's credit balance.
 */
export async function getCredits() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return 0

  const { data, error } = await supabase
    .from('users')
    .select('credits_remaining')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching credits:', error.message)
    return 0
  }

  return data.credits_remaining
}
