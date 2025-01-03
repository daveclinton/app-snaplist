import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useProducts } from '@/api/products/use-products';

import { getUserSessionIdTwo } from './auth';

const useProductListings = () => {
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);
  const { data, error, isLoading, refetch } = useProducts({
    variables: { id: userSupabaseId || '' },
    enabled: !!userSupabaseId,
  });

  useEffect(() => {
    const fetchSessionId = async () => {
      const sessionId = await getUserSessionIdTwo();
      setUserSupabaseId(sessionId);
    };
    fetchSessionId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userSupabaseId) {
        refetch();
      }
    }, [userSupabaseId, refetch]),
  );

  return { data, error, isLoading, userSupabaseId };
};

export default useProductListings;
