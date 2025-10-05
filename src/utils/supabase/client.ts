import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qfqstfrrmiymqjlrspjm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcXN0ZnJybWl5bXFqbHJzcGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTY3ODIsImV4cCI6MjA3NDg5Mjc4Mn0.BcYp8iwicnlQBQ265esLJUhPHRYUnlHEb4m2jHoYA3c";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);