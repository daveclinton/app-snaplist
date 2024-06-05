import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { client } from "./common/client";

type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const usePosts = createQuery<Response, Variables, AxiosError>({
  queryKey: [""],
  fetcher: () => {
    return client.get(`inventory`).then((response) => response.data);
  },
});
