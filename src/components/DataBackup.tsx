import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { showSuccess, showError } from '@/utils/toast'

export function DataBackup() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const exportData = async () => {
    setLoading(true)
    try {
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)

      const { data: progress } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)

      const blob = new Blob([JSON.stringify({ skills, progress }, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `skill-tracker-backup-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      showSuccess('Data exported successfully!')
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={exportData}
      disabled={loading}
    >
      {loading ? 'Exporting...' : 'Export All Data'}
    </Button>
  )
}