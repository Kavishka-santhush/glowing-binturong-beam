import { useQuery, useMutation } from '@tanstack/react-query'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { columns } from './user-columns'
import { useToast } from '@/components/ui/use-toast'

export function UserManagement() {
  const { toast } = useToast()
  
  const { data: users, refetch } = useQuery(['admin-users'], async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    return data
  })

  const promoteUser = useMutation(async (userId: string) => {
    const { error } = await supabase.rpc('promote_to_admin', { user_id: userId })
    if (error) throw error
  }, {
    onSuccess: () => {
      toast({ title: 'User promoted to admin' })
      refetch()
    }
  })

  return (
    <div className="p-6">
      <DataTable
        columns={columns(promoteUser.mutateAsync)} 
        data={users || []}
        searchKey="email"
      />
    </div>
  )
}