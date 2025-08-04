// Add to imports
import { AIRecommendations } from '@/components/AIRecommendations'
import { ProgressTracker } from '@/components/ProgressTracker'
import { SkillShare } from '@/components/SkillShare'

// Add to the skill detail page (before closing main div)
<div className="mt-8 space-y-6">
  <ProgressTracker skillId={id!} />
  <AIRecommendations skillName={skill?.name || ''} />
  <div className="flex justify-end">
    <SkillShare skillId={id!} />
  </div>
</div>