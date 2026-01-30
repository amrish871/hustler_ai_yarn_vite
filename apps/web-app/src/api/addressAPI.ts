import { apiClient } from "./client";
import { API_USER_ADDRESSES, API_ADD_USER_ADDRESS, API_UPDATE_USER_ADDRESS, API_DELETE_USER_ADDRESS, API_MY_USER_ADDRESSES, API_SET_DEFAULT_USER_ADDRESS } from "./endpoints";

// Define add new user address interface
export interface AddUserAddress {
  user_id: number;
  isDefault: boolean;
  apartment_number: string;
  locality: string;
  landmark: string;
  latitude: number;
  longitude: number;
  latitude_delta: number;
  longitude_delta: number;
  formatted_address: string;
}
// Define a User address interface
export interface UserAddress extends AddUserAddress {
  id: number;
}



// Fetch all user addresses
export const fetchAddresses = async (): Promise<UserAddress[]> => {
  const response = await apiClient.get<UserAddress[]>(API_MY_USER_ADDRESSES);
  return response.data || [];
};

// Add a user address
export const addAddress = async (data: AddUserAddress): Promise<UserAddress> => {
  const response = await apiClient.post<UserAddress>(API_ADD_USER_ADDRESS, data);
  return response.data;
};

// Update a user address
export const updateAddress = async (addressId: number, data: AddUserAddress): Promise<UserAddress> => {
  const response = await apiClient.put<UserAddress>(API_UPDATE_USER_ADDRESS(addressId), data);
  return response.data;
}

// export const useUpdateUserAddress = () => {
//   return useMutation({
//     mutationFn: (variables: {userAddressId: number; data: AddUserAddress}) =>
//       updateUserAddress(variables.userAddressId, variables.data),
//   });
// };

// Delete a user address
export const deleteAddress = async (addressId: number): Promise<void> => {
  await apiClient.delete<UserAddress>(API_DELETE_USER_ADDRESS(addressId));
}

export const fetchMyAddresses = async (): Promise<UserAddress[]> => {
  const response = await apiClient.get<UserAddress[]>(API_MY_USER_ADDRESSES);
  return response.data || [];
};

export const setDefaultAddress = async (addressId: number): Promise<UserAddress> => {
  console.log('useSetDefaultAddress called', addressId);
  const response = await apiClient.patch<UserAddress>(API_SET_DEFAULT_USER_ADDRESS(addressId));
  return response.data;
}


