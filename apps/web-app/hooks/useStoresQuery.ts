import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchStoresByCategory } from "../src/api/storesAPI";

export const useFetchStoresByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["fetchStoresByCategory", categoryId],
    queryFn: () => fetchStoresByCategory(categoryId),
    enabled: categoryId !== null && categoryId !== 0 && categoryId !== undefined, // Prevents automatic execution,
  });
};



