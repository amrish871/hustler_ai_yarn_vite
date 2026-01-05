import { apiClient } from "./client";
import { API_STORES_BY_CATEGORY } from "./endpoints";


// Step 1: Send OTP API Call
export const fetchStoresByCategory = async (categoryId: number): Promise<any> => {
  const response = await apiClient.get(API_STORES_BY_CATEGORY(categoryId));
  return response.data;
};
