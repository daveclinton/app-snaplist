import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";

type Variables = {
  email: string;
  phone_number?: string;
  password: string;
};
type Response = any;

export const useSignUp = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: "/signup",
      method: "POST",
      data: variables,
    }).then((response) => {
      return response?.data;
    });
  },
});
