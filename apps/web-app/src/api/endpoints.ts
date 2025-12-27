export const API_REQUEST_LOGIN_OTP = "/api/v1/request-login-otp/"
export const API_VERIFY_LOGIN_OTP = "/api/v1/verify-login-otp/"

// users
export const API_GET_USER_BY_PHONE_NUMBER = (phoneNumber: number | string) => `/api/v1/users/get-user-by-mobile-number/${phoneNumber}/`
export const API_UPDATE_USER = (userId: number | string) => `/api/v1/users/${userId}/`
export const API_GET_USER_BY_ID = (userId: number | string) => `/api/v1/users/${userId}/`

// user addressses
export const API_USER_ADDRESSES  = "/api/v1/user-addresses/"
export const API_ADD_USER_ADDRESS = "/api/v1/user-addresses/"
export const API_UPDATE_USER_ADDRESS = (userAddressId: number | string) => `/api/v1/user-addresses/${userAddressId}/`
export const API_DELETE_USER_ADDRESS = (userAddressId: number | string) => `/api/v1/user-addresses/${userAddressId}/`

//default user address
export const API_GET_DEFAULT_USER_ADDRESSES  = (userId: number | string) => `/api/v1/default-user-address/${userId}/`
export const API_SET_DEFAULT_USER_ADDRESSES  = "/api/v1/default-user-address/"



export const AUTH_BYPASS_URLS = [API_REQUEST_LOGIN_OTP, API_VERIFY_LOGIN_OTP]