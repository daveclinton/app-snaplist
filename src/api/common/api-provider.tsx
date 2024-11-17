import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import * as React from 'react';
import { useCallback } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 2,
      staleTime: 1000 * 60 * 0.2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);
  useFocusEffect(
    useCallback(() => {
      focusManager.setFocused(true);

      return () => {
        focusManager.setFocused(false);
      };
    }, []),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
