import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePendingRequests() {
  const [pendingCount, setPendingCount] = useState(0)
  const refreshPendingCount = useCallback(async () => {
    if (!supabase) return
    const { count } = await supabase.from('student_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    setPendingCount(count ?? 0)
  }, [])
  useEffect(() => {
    if (!supabase) return
    const client = supabase
    void refreshPendingCount()
    const channel = client.channel('admin-pending-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_requests' }, refreshPendingCount)
      .subscribe()
    return () => { void client.removeChannel(channel) }
  }, [refreshPendingCount])
  return { pendingCount, refreshPendingCount }
}
