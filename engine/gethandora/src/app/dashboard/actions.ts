'use server'

import { createClient } from '@/utils/supabase/server'
import { generateSocialContent } from '@/utils/ai'
import { useCredit } from '@/utils/credits'
import { hasUsedFreeTrial, markFreeTrialUsed } from '@/utils/free-tier'
import { redirect } from 'next/navigation'

export async function handleGenerate(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const topic = formData.get('topic') as string
  const brandConfig = {
    brandName: formData.get('brandName'),
    niche: formData.get('niche'),
    tone: formData.get('tone'),
    persona: formData.get('persona'),
    targetAudience: formData.get('targetAudience'),
    cta: formData.get('cta'),
    website: formData.get('website'),
  }

  // 1. Check Authenticated User Credits
  if (user) {
    const success = await useCredit(1)
    if (!success) {
      return { error: 'Insufficient credits or expired plan.' }
    }
  } else {
    // 2. Check Guest Free Trial
    const used = await hasUsedFreeTrial()
    if (used) {
      return { error: 'Free trial used. Please sign in to continue.', needsLogin: true }
    }
  }

  // 3. Generate Content
  try {
    const result = await generateSocialContent(topic, brandConfig)
    
    // 4. Mark Free Trial as Used (if guest)
    if (!user) {
      await markFreeTrialUsed()
    }

    // 5. Save to History (if logged in)
    if (user) {
        await supabase.from('generations').insert([
            {
                user_id: user.id,
                platform: 'all',
                copy_output: JSON.stringify(result),
                image_url: result.image_url,
                niche: brandConfig.niche,
                brand_name: brandConfig.brandName
            }
        ])
    }

    return { success: true, data: result }
  } catch (err: any) {
    console.error('Generation Action Error:', err)
    return { error: 'Something went wrong during generation.' }
  }
}
