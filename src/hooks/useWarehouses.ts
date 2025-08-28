import { client } from "@/lib/apollo";
import { GET_WAREHOUSES } from "@/lib/graphql";
import type { WarehousesQueryResult } from "@/types/graphql";
import { useQuery } from "@tanstack/react-query";

export const useWarehouses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const result = await client.query<WarehousesQueryResult>({
        query: GET_WAREHOUSES,
      });
      return result.data;
    },
  });

  return {
    warehouses: data?.warehouses || [],
    loading: isLoading,
    error,
  };
};
