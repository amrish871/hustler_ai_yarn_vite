import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchStoreSkusByStoreId } from "../src/api/storeSkuAPI";

export const useFetchStoreSkusByStoreId = (storeId: number) => {
  return useQuery({
    queryKey: ["fetchStoreSkusByStoreId", storeId],
    queryFn: () => fetchStoreSkusByStoreId(storeId),
    enabled: storeId !== null && storeId !== 0 && storeId !== undefined, // Prevents automatic execution,
  });
};

