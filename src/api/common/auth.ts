import { supabase } from '@/core/supabase';

export const getUserSessionIdTwo = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.error('Error fetching session:', error);
      return null;
    }
    return data.session.user.id; // Return the user ID from the session
  } catch (error) {
    console.error('Error in getUserSessionId:', error);
    return null;
  }
};
