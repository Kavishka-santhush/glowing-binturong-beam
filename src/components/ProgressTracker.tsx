import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showSuccess, showError } from '@/utils/toast'
import { supabase } from '@/integrations/supabase/client'

export function ProgressTracker({ skillId }: { skillId: string }) {
  const [minutes, setMinutes] = useState('30')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const logProgress = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('daily_progress')
        .insert([{
          skill_id: skillId,
          minutes: parseInt(minutes),
          notes,
          user_id: (await supabase.auth.getSession()).data.session?.user.id
        }])

      if (error) throw error
      showSuccess('Progress logged successfully!')
      setNotes('')
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium">Log Today's Progress</h3>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-20"
          min="1"
        />
        <span>minutes</span>
      </div>
      <Textarea
        placeholder="What did you work on? (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button onClick={logProgress} disabled={loading}>
        {loading ? 'Logging...' : 'Log Progress'}
      </Button>
    </div>
  )
}