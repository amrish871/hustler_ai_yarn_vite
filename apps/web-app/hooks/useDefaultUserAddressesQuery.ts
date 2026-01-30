import {useQuery, useMutation} from '@tanstack/react-query';
import {
  fetchDefaultUserAddress,
  setDefaultUserAddress
} from '../api/defaultUserAddressesAPI';
import { userId } from './useUsersQuery';
import queryClient from '../queries/queryClient';

export const useFetchDefaultUserAddress = (userId: number) => {
  return useQuery({
    queryKey: ["defaultUserAddress", userId],
    queryFn: () => fetchDefaultUserAddress(userId),
  });
};

export const useSetDefaultUserAddress = () => {
  return useMutation({
    mutationFn: setDefaultUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultUserAddress'] });
    },
  });
};



