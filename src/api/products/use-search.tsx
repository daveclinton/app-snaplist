import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

interface SearchQueryVariables {
  query: string;
  limit?: number;
  page?: number;
}

interface SearchResponse {
  products: any[];
  total: number;
  page: number;
  limit: number;
}

export const useImageSearch = createQuery<
  SearchResponse,
  SearchQueryVariables,
  AxiosError
>({
  queryKey: ['imageSearch'],
  fetcher: ({ query, limit = 20, page = 1 }) => {
    return client
      .get('/images/search', {
        params: {
          query,
          limit,
          page,
        },
      })
      .then((response) => response.data);
  },
});
