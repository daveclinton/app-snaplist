import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Response = any;

export const useAddProduct = createMutation<Response, any, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/products',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
