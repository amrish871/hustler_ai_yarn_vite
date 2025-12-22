export const ApiRoutes = {
  AUTH: {
    LOGIN: 'api/v1/request-login-otp/',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id: number | string) => `/users/${id}`
  },
  BOOKINGS: {
    BASE: '/bookings',
    DETAIL: (id: number | string) => `/bookings/${id}`
  }
} as const;

export type ApiRoutesType = typeof ApiRoutes;