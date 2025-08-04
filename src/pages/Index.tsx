import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { showError, showSuccess } from '@/utils/toast';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { loading, error, fetchSkills, addSkill } = useSupabase();
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadSkills();
    }
  }, [user, navigate]);

  const loadSkills = async () => {
    const data = await fetchSkills();
    setSkills(data || []);
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    
    const skill = await addSkill(newSkillName);
    if (skill) {
      setSkills([skill, ...skills]);
      setNewSkillName('');
      showSuccess('Skill added successfully!');
    } else if (error) {
      showError(error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Skill Tracker</h1>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
      
      <div className="grid gap-4 mb-8">
        <div className="flex gap-2">
          <Input
            placeholder="Enter skill name"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} disabled={loading}>
            {loading ? 'Adding...' : 'Add Skill'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Your Skills</h2>
        {skills.length === 0 ? (
          <p className="text-gray-500">No skills added yet. Start by adding one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card 
                key={skill.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/skill/${skill.id}`)}
              >
                <CardHeader>
                  <CardTitle>{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={0} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">0% complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;