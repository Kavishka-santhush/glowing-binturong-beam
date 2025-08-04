import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{ name }])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchSkills,
    addSkill,
  };
}