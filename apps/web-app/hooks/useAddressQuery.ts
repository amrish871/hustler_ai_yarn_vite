import {useQuery, useMutation} from '@tanstack/react-query';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  AddUserAddress,
  fetchMyAddresses,
  setDefaultAddress
} from '../src/api/addressAPI';
import queryClient from '../src/queries/queryClient';

export const useFetchAddresses = () => {
  return useQuery({
    queryKey: ['fetchAddresses'],
    queryFn: fetchAddresses,
  });
};

export const useAddAddress = () => {
  return useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['addAddress'] });
    },
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: (variables: {userAddressId: number; data: AddUserAddress}) =>
      updateAddress(variables.userAddressId, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['updateAddress'] });
  },
  });
};

export const useSetDefaultAddress = () => {
  
  return useMutation({
    mutationFn: (variables: {userAddressId: number; }) =>
      setDefaultAddress(variables.userAddressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setDefaultAddress'] });
  },
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: (variables: {userAddressId: number; }) => deleteAddress(variables.userAddressId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['deleteAddress'] });
    },
  });
};


export const useFetchMyAddresses = () => {
  return useQuery({
    queryKey: ['fetchMyAddresses'],
    queryFn: fetchMyAddresses,
  });
};

