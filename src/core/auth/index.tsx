/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';

import { createSelectors } from '../utils';
import { getToken, removeToken, setToken } from './utils';

export type TokenType = {
  access: string;
  refresh: string;
};

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  supabase: SupabaseClient;
  token: TokenType | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  cleanup: (() => void) | null; // Add cleanup function to state

  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

// Ensure environment variables are properly typed and available
if (!Env.NEXT_PUBLIC_SUPABASE_URL || !Env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(
  Env.NEXT_PUBLIC_SUPABASE_URL,
  Env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const _useAuth = create<AuthState>((set, get) => ({
  supabase,
  token: null,
  status: 'idle',
  isAuthenticated: false,
  cleanup: null,

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ status: 'loading' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.session) throw new Error('No session data received');

      const token: TokenType = {
        access: data.session.access_token,
        refresh: data.session.refresh_token,
      };

      await setToken(token);

      set({
        token,
        status: 'authenticated',
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      set({
        status: 'unauthenticated',
        token: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      set({ status: 'loading' });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data received');

      if (data.user.identities?.length === 0) {
        set({
          status: 'unauthenticated',
          token: null,
          isAuthenticated: false,
        });
        return;
      }

      if (data.session) {
        const token: TokenType = {
          access: data.session.access_token,
          refresh: data.session.refresh_token,
        };

        await setToken(token);

        set({
          token,
          status: 'authenticated',
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      set({
        status: 'unauthenticated',
        token: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Cleanup auth listener if it exists
      const { cleanup } = get();
      if (cleanup) {
        cleanup();
      }

      await removeToken();

      set({
        status: 'unauthenticated',
        token: null,
        isAuthenticated: false,
        cleanup: null,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  hydrate: async () => {
    try {
      // Cleanup existing listener if it exists
      const { cleanup } = get();
      if (cleanup) {
        cleanup();
      }

      set({ status: 'loading' });
      const storedToken = await getToken();

      if (!storedToken) {
        set({
          status: 'unauthenticated',
          token: null,
          isAuthenticated: false,
        });
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        throw new Error('Invalid session');
      }

      const newToken: TokenType = {
        access: session.access_token,
        refresh: session.refresh_token,
      };

      await setToken(newToken);

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        switch (event) {
          case 'SIGNED_IN':
            if (session) {
              const token: TokenType = {
                access: session.access_token,
                refresh: session.refresh_token,
              };
              await setToken(token);
              set({
                token,
                status: 'authenticated',
                isAuthenticated: true,
              });
            }
            break;
          case 'SIGNED_OUT':
            await removeToken();
            set({
              token: null,
              status: 'unauthenticated',
              isAuthenticated: false,
            });
            break;
          case 'TOKEN_REFRESHED':
            if (session) {
              const token: TokenType = {
                access: session.access_token,
                refresh: session.refresh_token,
              };
              await setToken(token);
              set({ token });
            }
            break;
        }
      });

      // Store the cleanup function in state
      set({
        token: newToken,
        status: 'authenticated',
        isAuthenticated: true,
        cleanup: () => subscription.unsubscribe(),
      });
    } catch (error) {
      console.error('Hydration error:', error);
      await removeToken();
      set({
        status: 'unauthenticated',
        token: null,
        isAuthenticated: false,
        cleanup: null,
      });
    }
  },
}));

// Create selectors for better performance
export const useAuth = createSelectors(_useAuth);

// Selector hooks for specific state pieces
export const useAuthStatus = () => useAuth((state) => state.status);
export const useIsAuthenticated = () =>
  useAuth((state) => state.isAuthenticated);
export const useToken = () => useAuth((state) => state.token);

// Export auth methods directly
export const {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  hydrate: hydrateAuth,
} = _useAuth.getState();
