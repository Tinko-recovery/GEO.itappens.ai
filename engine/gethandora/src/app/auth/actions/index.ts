'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error.message)
    return redirect('/?error=Could not authenticate user')
  }

  if (data.url) {
    redirect(data.url) // use the redirection URL to sign in
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
