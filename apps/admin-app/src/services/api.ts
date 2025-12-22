import { createApiInstance, createApiService } from '@myorg/api';
import { getEnvironment } from '@myorg/config';

const env = getEnvironment();

// Create API instance with configuration
const api = createApiInstance(
  {
    baseURL: env.apiBaseUrl,
    timeout: env.appEnv === 'development' ? 30000 : 15000,
  },
  {
    // APIs that should NOT receive the Authorization header
    excludedPaths: ['/login', '/auth/login', '/auth/refresh'],
    skipAuthHeader: 'x-skip-auth',
  }
);

// Create API service
export const apiService = createApiService(api);