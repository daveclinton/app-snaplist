import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useSession } from '~/context/SessionContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      router.replace('/(drawer)');
    }
  }, [session, segments]);

  return <>{children}</>;
}
