import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

interface QueryVariables {
  userSupabaseId: string;
}

interface Marketplace {
  id: number;
  name: string;
  slug: string;
  icon_url: string;
  is_supported: boolean;
  is_linked: boolean;
  oauth: {
    oauth_url: string;
    token_url: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    scope: string;
  };
  oauth_url: string;
}

type MarketplacesResponse = Marketplace[];

export const useMarkeplaces = createQuery<
  MarketplacesResponse,
  QueryVariables,
  AxiosError
>({
  queryKey: ['marketplaces'],
  fetcher: ({ userSupabaseId }) => {
    return client
      .get(`marketplaces/${userSupabaseId}`)
      .then((response) => response.data);
  },
});
