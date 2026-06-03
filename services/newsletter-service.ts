'use server'

import { supabase } from '@/services/supabase'

export async function subscribeToNewsletter(email: string, sessionId: string) {
  try {
    if (!email) {
      return { success: false, error: 'Email is required' }
    }

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        session_id: sessionId || 'anonymous',
      })
      .select()
      .single()

    if (error) {
      // Postgres unique violation code is 23505
      if (error.code === '23505') {
        return { success: false, error: 'This email is already subscribed.' }
      }
      console.error('Error inserting newsletter subscription:', error)
      return { success: false, error: 'Failed to subscribe. Please try again later.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error in subscribeToNewsletter:', err)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
