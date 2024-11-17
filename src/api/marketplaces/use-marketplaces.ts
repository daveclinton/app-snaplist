import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

interface QueryVariables {
  userSupabaseId: string;
}

type Marketplace = {
  connectionStatus: string;
  marketplace: {
    icon_url: string;
    id: number;
    is_linked: boolean;
    is_supported: boolean;
    mobile_app: any;
    name: string;
    oauth: any;
    slug: string;
  };
  oauth_url: string;
};

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
