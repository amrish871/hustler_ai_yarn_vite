import { useQuery, useMutation } from "@tanstack/react-query";
import { placeOrder } from "../src/api/ordersAPI";
import queryClient from "../src/queries/queryClient";


export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['placeOrder'] });
    },
  });
};

