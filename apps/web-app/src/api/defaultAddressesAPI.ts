import { apiClient } from "./client";
import { API_SET_DEFAULT_USER_ADDRESSES, API_GET_DEFAULT_USER_ADDRESSES } from "./endpoints";

// Define add new user address interface
export interface DefaultUserAddress {
  user_id: number;
  default_user_address_id: number;
}




// Fetch all user addresses
export const fetchDefaultUserAddress = async (userId: number): Promise<DefaultUserAddress> => {
  const response = await apiClient.get<DefaultUserAddress>(API_GET_DEFAULT_USER_ADDRESSES(userId));
  return response.data;
};

// Add/Update a default user address
export const setDefaultUserAddress = async (data: DefaultUserAddress): Promise<DefaultUserAddress> => {
  const response = await apiClient.post<DefaultUserAddress>(API_SET_DEFAULT_USER_ADDRESSES, data);
  return response.data;
};





