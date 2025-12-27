import { apiClient } from "./client";
import { API_REQUEST_LOGIN_OTP, API_VERIFY_LOGIN_OTP } from "./endpoints";


// Step 1: Send OTP API Call
export const sendOtp = async (mobile: string): Promise<any> => {
  const response = await apiClient.post(API_REQUEST_LOGIN_OTP, { mobile_number: mobile });
  return response.data;
};

// Step 2: Verify OTP API Call
export const verifyOtp = async (mobile: string, otp: string): Promise<any> => {
  const response = await apiClient.post(API_VERIFY_LOGIN_OTP, { mobile_number: mobile, otp: otp });
  return response.data;
};