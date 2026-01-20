import { useQuery, useMutation } from "@tanstack/react-query";
import { placeOrder } from "../src/api/ordersAPI";

export const usePlaceOrder = (order: any) => {
  return useQuery({
    queryKey: ["placeOrder"],
    queryFn: () => placeOrder(order),
    enabled: order !== null && order !== 0 && order !== undefined, // Prevents automatic execution,
  });
};

