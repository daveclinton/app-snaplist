/* eslint-disable max-lines-per-function */
import { type SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '../supabase';
import { createSelectors } from '../utils';
import { getToken, removeToken, setToken } from './utils';
import { show as showToast } from '@/components/toast';

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

      console.log('Listen here', data);

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
      showToast('Successfully signed in', 'success');
    } catch (error) {
      console.error('Sign in error:', error);
      set({
        status: 'unauthenticated',
        token: null,
        isAuthenticated: false,
      });
      showToast(
        error instanceof Error ? error.message : 'Failed to sign in',
        'error',
      );
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
        showToast('Email already registered', 'warning');
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
        showToast('Successfully signed up', 'success');
      } else {
        showToast('Please check your email to confirm your account', 'info');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      set({
        status: 'unauthenticated',
        token: null,
        isAuthenticated: false,
      });
      showToast(
        error instanceof Error ? error.message : 'Failed to sign up',
        'error',
      );
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

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

      showToast('Successfully signed out', 'success');
    } catch (error) {
      console.error('Sign out error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to sign out',
        'error',
      );
      throw error;
    }
  },

  hydrate: async () => {
    try {
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

      const sessionToken = {
        access_token: storedToken.access,
        refresh_token: storedToken.refresh,
      };

      const { data, error } = await supabase.auth.setSession(sessionToken);

      if (error || !data.session) {
        throw new Error('Invalid session');
      }

      const newToken: TokenType = {
        access: data.session.access_token,
        refresh: data.session.refresh_token,
      };

      await setToken(newToken);

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
              showToast('Session restored', 'success');
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
              showToast('Session refreshed', 'info');
            }
            break;
        }
      });

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
      showToast('Session expired', 'error');
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
