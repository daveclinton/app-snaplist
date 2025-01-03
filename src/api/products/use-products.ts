import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

// Define the Variables type
type Variables = { id: string };

// Create the query
export const useProducts = createQuery<any[], Variables, AxiosError>({
  queryKey: ['products', 'user'],
  fetcher: (variables) => {
    return client
      .get(`/products/user/${variables.id}`)
      .then((response) => response.data);
  },
});
