// import { createAxiosInstance } from 'shared-utils/src/axiosInstance';
// import { API_BASE_URL } from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const getToken = async () => {
//   return await AsyncStorage.getItem('access-token');
// };

// export const apiClient = createAxiosInstance({
//   // baseURL: API_URL,
//   baseURL: API_BASE_URL, // Replace with your actual API URL
//   getToken,
//   onUnauthorized: () => {
//     console.warn('Unauthorized! Redirect to login or refresh token.');
//   },
// });



import { createApiInstance, createApiService } from '@myorg/shared-api/apiService';

// Create API instance with configuration
const api = createApiInstance(
  {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dev-hustle-service-g9g6emembfdyhwd4.canadacentral-01.azurewebsites.net/',
  },
  {
    excludedPaths: ['/login', '/auth/login', '/auth/refresh'],
    skipAuthHeader: 'x-skip-auth',
  }
);

// Create API service
export const apiClient = createApiService(api);