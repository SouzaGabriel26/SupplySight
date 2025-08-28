import { client } from "@/lib/apollo";
import { GET_PRODUCTS } from "@/lib/graphql";
import type {
  ProductsQueryResult,
  ProductsQueryVariables,
} from "@/types/graphql";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (variables: ProductsQueryVariables = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", variables],
    queryFn: async () => {
      const result = await client.query<ProductsQueryResult>({
        query: GET_PRODUCTS,
        variables,
      });
      return result.data;
    },
  });

  return {
    products: data?.products || [],
    loading: isLoading,
    error,
    refetch,
  };
};
