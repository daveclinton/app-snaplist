import { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

interface SessionContextType {
  session: Session | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isLoading: boolean;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
