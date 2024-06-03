import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";

type Response = any;

export const useVerifyOTP = createMutation<Response, any, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: "/verify-account",
      method: "POST",
      data: variables,
    }).then((response) => {
      return response.data;
    });
  },
});

export const useResendOtp = createMutation<Response, any, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: "/resend-otp",
      method: "POST",
      data: variables,
    }).then((response) => {
      return response.data;
    });
  },
});
