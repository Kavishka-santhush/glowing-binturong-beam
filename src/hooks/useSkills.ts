import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useSkills() {
  const queryClient = useQueryClient()

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })

  const addSkill = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('skills')
        .insert([{ name }])
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    }
  })

  return { skills, isLoading, addSkill }
}