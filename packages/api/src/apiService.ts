import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
}

export interface ApiOptions {
  /** list of URL paths (prefix or full path) that should NOT receive the Authorization header */
  excludedPaths?: string[];
  /** header name that can be set on an individual request to skip auth (e.g. {'x-skip-auth': 'true'}) */
  skipAuthHeader?: string;
}

// Create configurable axios instance factory
export const createApiInstance = (
  config: ApiConfig,
  options: ApiOptions = {}
): AxiosInstance => {
  const api: AxiosInstance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    (reqConfig) => {
      // If request explicitly asks to skip auth via header, don't attach token
      const skipHeader = options.skipAuthHeader || 'x-skip-auth';
      const shouldSkipHeader =
        reqConfig.headers &&
        // header keys may be normalized by axios; check both
        (reqConfig.headers[skipHeader] === 'true' || reqConfig.headers[skipHeader] === true || reqConfig.headers['X-Skip-Auth'] === 'true');

      if (shouldSkipHeader) {
        // clean up the header so it isn't sent to server
        if (reqConfig.headers) {
          delete reqConfig.headers[skipHeader];
          delete reqConfig.headers['X-Skip-Auth'];
        }
        return reqConfig;
      }

      // Determine request path to compare against excludedPaths
      const excluded = options.excludedPaths || ['/login'];
      let requestPath = '';
      try {
        // If url is absolute or relative, construct full URL using baseURL
        const base = api.defaults.baseURL || window?.location?.origin || '';
        const full = new URL(reqConfig.url || '', base);
        requestPath = full.pathname + (full.search || '');
      } catch (e) {
        // fallback: use raw url
        requestPath = reqConfig.url || '';
      }

      const isExcluded = excluded.some((p) => {
        if (!p) return false;
        // match by exact, startsWith or includes to be flexible
        return requestPath === p || requestPath.startsWith(p) || requestPath.endsWith(p) || requestPath.includes(p);
      });

      if (isExcluded) return reqConfig;

      // Get token from localStorage or your auth state management
      // Default storage key used by AuthProvider is 'authToken'
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (token) {
        if (!reqConfig.headers) reqConfig.headers = {} as any;
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }

      return reqConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // Handle specific status codes
        switch (error.response.status) {
          case 400:
            console.error('Bad Request:', error.response.data);
            break;
            case 401:
            console.error('Unauthorized');
            // Handle unauthorized access (e.g., redirect to login)
            try { localStorage.removeItem('authToken'); } catch (e) { /* ignore */ }
            // You might want to redirect to login page here
            break;
          case 403:
            console.error('Forbidden');
            break;
          case 404:
            console.error('Not Found');
            break;
          case 500:
            console.error('Internal Server Error');
            break;
          default:
            console.error('Server Error:', error.response.data);
        }
      } else if (error.request) {
        // Network error or no response received
        console.error('Network Error:', error.message);
      } else {
        console.error('Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Create API service factory
export const createApiService = (api: AxiosInstance) => ({
  get: async <T>(url: string, config = {}) => {
    try {
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async <T>(url: string, data = {}, config = {}) => {
    try {
      const response = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async <T>(url: string, data = {}, config = {}) => {
    try {
      const response = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async <T>(url: string, config = {}) => {
    try {
      const response = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

/**
 * Helper to set or clear the auth token in localStorage programmatically.
 * This is useful when you want to synchronize non-React code with the auth state.
 */
export const setAuthToken = (token?: string | null) => {
  try {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  } catch (e) {
    // ignore (e.g., SSR or restricted storage)
  }
};