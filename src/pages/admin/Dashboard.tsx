import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './moderation-columns'

export function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { count: users } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
      
      const { count: skills } = await supabase
        .from('skills')
        .select('*', { count: 'exact' })
      
      const { count: pending } = await supabase
        .from('moderated_content')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
      
      return { users, skills, pending }
    }
  })

  const { data: reports } = useQuery({
    queryKey: ['moderation-reports'],
    queryFn: async () => {
      const { data } = await supabase
        .from('moderated_content')
        .select(`
          *,
          reported_by:users!reported_by(name, email),
          reviewed_by:users!reviewed_by(name)
        `)
        .order('reported_at', { ascending: false })
        .limit(50)
      return data || []
    }
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.users || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Skills Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.skills || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pending || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={reports || []}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}