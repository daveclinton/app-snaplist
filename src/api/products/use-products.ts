import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

// Define the Product type
interface Product {
  id: number;
  title: string;
  sku: string;
  description: string;
  price: string;
  categories: string[];
  images: string[];
  stock_quantity: number;
  condition: string;
  discount_percentage: number;
  tags: string | null;
  userId: string;
  created_at: string;
  updated_at: string;
  marketplace_listings: any[];
}

// Define the Variables type
type Variables = { id: string };

// Create the query
export const useProducts = createQuery<Product[], Variables, AxiosError>({
  queryKey: ['products', 'user'],
  fetcher: (variables) => {
    return client
      .get(`/products/user/${variables.id}`)
      .then((response) => response.data);
  },
});
