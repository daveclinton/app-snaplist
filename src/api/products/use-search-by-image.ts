import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

// Define the response type for the search-by-image endpoint
interface SearchByImageResponse {
  itemSummaries: {
    itemId: string;
    title: string;
    price: { value: string };
    image: { imageUrl: string };
    shortDescription: string;
  }[];
}

// Define the Variables type for the query
type SearchByImageVariables = {
  imageUri: string;
  userId: string;
};

// Create the query
export const useSearchByImage = createQuery<
  SearchByImageResponse,
  SearchByImageVariables,
  AxiosError
>({
  queryKey: ['search-by-image'],
  fetcher: (variables) => {
    const formData = new FormData();
    formData.append('image', {
      uri: variables.imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('userId', variables.userId);

    return client
      .post('/ebay-categories/search-by-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data);
  },
});
