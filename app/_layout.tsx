import '../global.css';
import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, Slot } from 'expo-router';
import { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorScreen } from '~/components/ErrorBoundary';
import { LoadingScreen } from '~/components/LoadingScreen';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { SessionContext } from '~/context/SessionContext';
import { storage } from '~/utils/storage';
import { supabase } from '~/utils/supabase';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      await setupAuthSubscription();
      setIsReady(true);
    };
    initialize();
  }, []);

  const setupAuthSubscription = async () => {
    try {
      const persistedSession = await storage.getItem<Session>('session');
      if (persistedSession) {
        setSession(persistedSession);
      }

      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (currentSession) {
        setSession(currentSession);
        await storage.setItem('session', currentSession);
        if (isReady) router.replace('/(drawer)');
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          await storage.setItem('session', newSession);
          if (isReady) router.replace('/(drawer)');
        } else {
          await storage.removeItem('session');
          if (isReady) router.replace('/auth/login');
        }
      });

      setIsLoading(false);

      return () => {
        subscription?.unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      await storage.removeItem('session');
      setSession(null);
      if (isReady) {
        setTimeout(() => {
          router.replace('/auth/login');
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session: refreshedSession },
        error: refreshError,
      } = await supabase.auth.refreshSession();

      if (refreshError) throw refreshError;

      if (refreshedSession) {
        setSession(refreshedSession);
        await storage.setItem('session', refreshedSession);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh session'));
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onReset={() => {
          setError(null);
          setupAuthSubscription();
        }}
      />
    );
  }

  if (isLoading || !isReady) {
    return <LoadingScreen />;
  }

  return (
    <SessionContext.Provider value={{ session, signOut, refreshSession, isLoading }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ProtectedRoute>
          {session ? (
            <Slot />
          ) : (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/signup" />
            </Stack>
          )}
        </ProtectedRoute>
      </GestureHandlerRootView>
    </SessionContext.Provider>
  );
}
