import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const BUFFER_API = 'https://api.bufferapp.com/1/updates/create.json'

type Platform = 'linkedin' | 'instagram'

const PLATFORM_PROFILE_MAP: Record<Platform, string | undefined> = {
  linkedin: process.env.BUFFER_LINKEDIN_PROFILE_ID,
  instagram: process.env.BUFFER_INSTAGRAM_PROFILE_ID,
}

const CONTENT_MAP: Record<Platform, keyof BufferPostBody> = {
  linkedin: 'linkedin_personal',
  instagram: 'instagram',
}

interface BufferPostBody {
  platforms: Platform[]
  linkedin_personal: string
  linkedin_brand: string
  twitter: string
  instagram: string
  image_url?: string
}

async function queueToBuffer(
  accessToken: string,
  profileId: string,
  text: string,
  imageUrl?: string
) {
  const params = new URLSearchParams()
  params.append('access_token', accessToken)
  params.append('profile_ids[]', profileId)
  params.append('text', text)
  if (imageUrl) {
    params.append('media[photo]', imageUrl)
    params.append('media[thumbnail]', imageUrl)
  }

  const res = await fetch(BUFFER_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Buffer API error (${res.status}): ${err}`)
  }

  return res.json()
}

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: BufferPostBody = await request.json()
    const { platforms, image_url } = body

    if (!platforms?.length) {
      return NextResponse.json({ error: 'No platforms selected' }, { status: 400 })
    }

    // Per-user token takes priority, then fall back to env var
    const { data: userRow } = await supabase
      .from('users')
      .select('buffer_access_token')
      .eq('id', user.id)
      .single()

    const accessToken = userRow?.buffer_access_token || process.env.BUFFER_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ error: 'Buffer access token not configured' }, { status: 400 })
    }

    const results: { platform: Platform; success: boolean; error?: string }[] = []

    for (const platform of platforms) {
      const profileId = PLATFORM_PROFILE_MAP[platform]
      const contentKey = CONTENT_MAP[platform]
      const text = body[contentKey] as string

      if (!profileId) {
        results.push({ platform, success: false, error: 'Profile ID not configured' })
        continue
      }

      if (!text) {
        results.push({ platform, success: false, error: 'No content for platform' })
        continue
      }

      try {
        await queueToBuffer(accessToken, profileId, text, image_url)
        results.push({ platform, success: true })
      } catch (err: any) {
        results.push({ platform, success: false, error: err.message })
      }
    }

    const allFailed = results.every(r => !r.success)
    if (allFailed) {
      return NextResponse.json({ error: 'All posts failed', results }, { status: 500 })
    }

    return NextResponse.json({ status: 'ok', results })
  } catch (error: any) {
    console.error('Buffer post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
