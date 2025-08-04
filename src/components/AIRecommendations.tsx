import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showLoading, dismissToast } from '@/utils/toast'

export function AIRecommendations({ skillName }: { skillName: string }) {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const getRecommendations = async () => {
    const toastId = showLoading('Getting AI recommendations...')
    setLoading(true)
    try {
      const response = await fetch(
        `https://kcmzxmpaxvbxoptzacow.supabase.co/functions/v1/skill-recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ skill: skillName })
        }
      )
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      console.error('Failed to get recommendations:', err)
    } finally {
      dismissToast(toastId)
      setLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Recommended Skills</span>
          <Button 
            size="sm" 
            onClick={getRecommendations}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Suggest Skills'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="p-2 border rounded hover:bg-accent">
                {rec}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Get AI-powered skill suggestions based on this skill
          </p>
        )}
      </CardContent>
    </Card>
  )
}