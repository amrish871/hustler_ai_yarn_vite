import { apiClient } from "./client";
import { API_PLACE_ORDER } from "./endpoints";


export const placeOrder = async (order: any): Promise<any> => {
  const response = await apiClient.post(API_PLACE_ORDER, order);
  return response.data;
};

