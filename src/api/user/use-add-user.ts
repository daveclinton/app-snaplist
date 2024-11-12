import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { type CreateUserResponse, type CreateUserVariables } from './types';

export const useCreateUser = createMutation<
  CreateUserResponse,
  CreateUserVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: 'users/create',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
