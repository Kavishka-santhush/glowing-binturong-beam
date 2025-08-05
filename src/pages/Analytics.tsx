import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'

export default function Analytics() {
  const { user } = useAuth()
  
  const { data: progressData } = useQuery({
    queryKey: ['progress-analytics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('daily_progress')
        .select(`
          date,
          minutes,
          skills(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true })
      return data || []
    }
  })

  const { data: skillDistribution } = useQuery({
    queryKey: ['skill-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('skills')
        .select(`
          name,
          daily_progress(minutes)
        `)
        .eq('user_id', user.id)
      return data?.map(skill => ({
        name: skill.name,
        minutes: skill.daily_progress.reduce((sum, p) => sum + p.minutes, 0)
      })) || []
    }
  })

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Learning Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Daily Progress</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="minutes" fill="#8884d8" name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Skill Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="minutes" fill="#82ca9d" name="Total Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}