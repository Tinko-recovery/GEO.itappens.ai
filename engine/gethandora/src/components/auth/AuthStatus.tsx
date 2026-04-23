import { createClient } from '@/utils/supabase/server'
import { signOut, signInWithGoogle } from '@/app/auth/actions'

export default async function AuthStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Logged in as {user.email}</span>
        <form action={signOut}>
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    )
  }

  return (
    <form action={signInWithGoogle}>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
        Sign in with Google
      </button>
    </form>
  )
}
