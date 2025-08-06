import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxjrunenotgotomeqtjl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4anJ1bmVub3Rnb3RvbWVxdGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NTU1MDgsImV4cCI6MjA3MDAzMTUwOH0.D3fXFkXOOEMeqJqg8OlUwM9A5CJJyRM7vxY7x-2G_50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
