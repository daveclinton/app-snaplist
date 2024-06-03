import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { client } from "../common/client";

type Variables = {
  username: string;
  password: string;
};

type ResponseData = {
  data: {
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

const USER_DATA_KEY = "user-data";

export const useLogin = createMutation<ResponseData, Variables, AxiosError>({
  mutationFn: async (variables) => {
    try {
      const response = await client.post<ResponseData>("/login", variables);
      const { data } = response;
      if (data && data.data) {
        const userData = JSON.stringify(data.data);
        await AsyncStorage.setItem(USER_DATA_KEY, userData);
      } else {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid response structure");
      }
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  },
});

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
