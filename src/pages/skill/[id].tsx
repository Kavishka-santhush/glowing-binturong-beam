import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const SkillDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roadmapItems, setRoadmapItems] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newRoadmapItem, setNewRoadmapItem] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadSkillData();
    }
  }, [user, navigate, id]);

  const loadSkillData = async () => {
    setLoading(true);
    try {
      // Fetch skill
      const { data: skillData, error: skillError } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .single();

      if (skillError) throw skillError;
      setSkill(skillData);

      // Fetch roadmap items
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('skill_id', id)
        .order('created_at', { ascending: true });

      if (roadmapError) throw roadmapError;
      setRoadmapItems(roadmapData || []);

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('skill_id', id)
        .order('created_at', { ascending: false });

      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('skill_id', id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (err) {
      showError(err.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const addRoadmapItem = async () => {
    if (!newRoadmapItem.trim()) return;

    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert([{ skill_id: id, name: newRoadmapItem }])
        .select();

      if (error) throw error;
      setRoadmapItems([...roadmapItems, data[0]]);
      setNewRoadmapItem('');
    } catch (err) {
      showError(err.message);
    }
  };

  const toggleRoadmapItem = async (itemId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ is_completed: !isCompleted })
        .eq('id', itemId);

      if (error) throw error;
      loadSkillData();
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading || !skill) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  const completedItems = roadmapItems.filter(item => item.is_completed).length;
  const progress = roadmapItems.length > 0 
    ? Math.round((completedItems / roadmapItems.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{skill.name}</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Progress</h2>
          <span className="text-sm text-gray-500">
            {completedItems} of {roadmapItems.length} topics completed
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new topic"
                value={newRoadmapItem}
                onChange={(e) => setNewRoadmapItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRoadmapItem()}
              />
              <Button onClick={addRoadmapItem}>Add</Button>
            </div>

            <div className="space-y-2">
              {roadmapItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={item.is_completed}
                    onChange={() => toggleRoadmapItem(item.id, item.is_completed)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
                  />
                  <span className={item.is_completed ? 'line-through text-gray-400' : ''}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <p>Resources will be displayed here</p>
        </TabsContent>

        <TabsContent value="projects">
          <p>Projects will be displayed here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillDetail;