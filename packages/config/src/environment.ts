interface Environment {
  apiBaseUrl: string;
  appName: string;
  appEnv: 'development' | 'production' | 'test';
  auth: {
    domain: string;
    clientId: string;
  };
  features: {
    featureX: boolean;
    featureY: boolean;
  };
}

export const getEnvironment = (): Environment => {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    appName: import.meta.env.VITE_APP_NAME,
    appEnv: import.meta.env.VITE_APP_ENV as Environment['appEnv'],
    auth: {
      domain: import.meta.env.VITE_AUTH_DOMAIN,
      clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    },
    features: {
      featureX: import.meta.env.VITE_ENABLE_FEATURE_X === 'true',
      featureY: import.meta.env.VITE_ENABLE_FEATURE_Y === 'true',
    },
  };
};

export const isProduction = (): boolean => getEnvironment().appEnv === 'production';
export const isDevelopment = (): boolean => getEnvironment().appEnv === 'development';
export const isTest = (): boolean => getEnvironment().appEnv === 'test';

// Type declaration for Vite's import.meta.env
interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_ENV: string;
  VITE_AUTH_DOMAIN: string;
  VITE_AUTH_CLIENT_ID: string;
  VITE_ENABLE_FEATURE_X: string;
  VITE_ENABLE_FEATURE_Y: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}