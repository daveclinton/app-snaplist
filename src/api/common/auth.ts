import { show as showToast } from '@/components/toast';
import { supabase } from '@/core/supabase';

export const getUserSessionIdTwo = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.error('Error fetching session:', error);
      showToast('Please sign in to continue', 'error');
      return null;
    }
    return data.session.user.id;
  } catch (error) {
    console.error('Error in getUserSessionId:', error);
    showToast('An error occurred. Please try again.', 'error');
    return null;
  }
};
