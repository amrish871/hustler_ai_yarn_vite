import { useMutation, useQuery, MutationFunction } from "@tanstack/react-query";
import { sendOtp, verifyOtp } from "../src/api/loginAPI";
// import queryClient from "packages/shared-utils/src/queryClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
    },
  });
};

export const useVerifyLoginOTP = () => {
  // Wrap verifyOtp to accept a single object argument
  // const mutationFn: MutationFunction<any, { mobile: string; otp: string }> = ({ mobile, otp }) => verifyOtp(mobile, otp);

  return useMutation({
    mutationFn: (variables: {phone: string; otp: string}) =>verifyOtp(variables.phone, variables.otp),
    onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
    },
  });
};
