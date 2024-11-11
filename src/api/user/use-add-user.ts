import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { type CreateUserResponse, type CreateUserVariables } from './types';

interface ErrorResponse {
  message: string;
  code: string;
}

export const useCreateUser = createMutation<
  CreateUserResponse,
  CreateUserVariables,
  AxiosError<ErrorResponse>
>({
  mutationFn: async (variables) => {
    try {
      const response = await client({
        url: 'users/create',
        method: 'POST',
        data: variables,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  retry: 2,
  retryDelay: 1000,
});
