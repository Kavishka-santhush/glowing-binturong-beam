// Add import
import { SkillProgressChart } from '@/components/SkillProgressChart';

// Add to dashboard layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
  <div className="lg:col-span-2">
    {/* Existing search and skill list */}
  </div>
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
    <SkillProgressChart skills={skills} />
  </div>
</div>