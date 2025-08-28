import { client } from "@/lib/apollo";
import { GET_KPIS } from "@/lib/graphql";
import type { KPIsQueryResult } from "@/types/graphql";
import { useQuery } from "@tanstack/react-query";

export const useKPIs = (range: string = "30d") => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["kpis", range],
    queryFn: async () => {
      const result = await client.query<KPIsQueryResult>({
        query: GET_KPIS,
        variables: { range },
      });
      return result.data;
    },
  });

  return {
    kpis: data?.kpis || [],
    loading: isLoading,
    error,
  };
};
