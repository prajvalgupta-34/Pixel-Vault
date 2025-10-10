import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          theme="dark"
          providers={['github', 'google']}
          redirectTo="http://localhost:3000/"
        />
      </div>
    </div>
  );
}