import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kcmzxmpaxvbxoptzacow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbXp4bXBheHZieG9wdHphY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDIwNzIsImV4cCI6MjA2OTg3ODA3Mn0.vb4Orlg6bDiXqXyU1x1BPmn4Y_RzDX2cm_c62OL-BWc';

export const supabase = createClient(supabaseUrl, supabaseKey);