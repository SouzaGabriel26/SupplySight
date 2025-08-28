import { client } from "@/lib/apollo";
import { TRANSFER_STOCK, UPDATE_DEMAND } from "@/lib/graphql";
import type { Product } from "@/types/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";

interface UpdateDemandResponse {
  updateDemand: Product;
}

interface TransferStockResponse {
  transferStock: Product;
}

interface UpdateDemandVariables {
  id: string;
  demand: number;
}

interface TransferStockVariables {
  id: string;
  from: string;
  to: string;
  qty: number;
}

export function useUpdateDemand() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, demand }: UpdateDemandVariables) => {
      const response = await client.mutate<UpdateDemandResponse>({
        mutation: UPDATE_DEMAND,
        variables: { id, demand },
      });
      return response.data?.updateDemand;
    },
    onMutate: async ({ id, demand }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(["products"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["products"], (old: Product[] | undefined) => {
        if (!old) return old;
        return old.map((product) =>
          product.id === id ? { ...product, demand } : product
        );
      });

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      addToast({
        type: "error",
        title: "Failed to transfer stock",
        message: error.message || "An error occurred while transferring stock",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      addToast({
        type: "success",
        title: "Demand updated successfully",
        message: "The product demand has been updated",
      });
    },
  });
}

export function useTransferStock() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, from, to, qty }: TransferStockVariables) => {
      const response = await client.mutate<TransferStockResponse>({
        mutation: TRANSFER_STOCK,
        variables: { id, from, to, qty },
      });
      return response.data?.transferStock;
    },
    onMutate: async ({ id, to, qty }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(["products"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["products"], (old: Product[] | undefined) => {
        if (!old) return old;
        return old.map((product) =>
          product.id === id
            ? { ...product, stock: product.stock - qty, warehouse: to }
            : product
        );
      });

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      addToast({
        type: "error",
        title: "Failed to update demand",
        message: error.message || "An error occurred while updating demand",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      addToast({
        type: "success",
        title: "Stock transferred successfully",
        message: "The stock has been transferred to the new warehouse",
      });
    },
  });
}
