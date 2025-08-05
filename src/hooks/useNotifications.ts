import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { showSuccess } from '@/utils/toast'

export function useNotifications() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'daily_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          showSuccess(`Logged ${payload.new.minutes} minutes of progress!`)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])
}