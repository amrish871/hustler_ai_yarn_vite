import { createApiInstance, createApiService } from '@myorg/api';

// Create API instance with configuration
const api = createApiInstance(
  {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  },
  {
    excludedPaths: ['/login', '/auth/login', '/auth/refresh'],
    skipAuthHeader: 'x-skip-auth',
  }
);

// Create API service
export const apiService = createApiService(api);