import { AxiosError } from 'axios';

export interface ErrorResponse {
  message: string;
  status: number;
}

export const getErrorMessage = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'An error occurred while processing your request',
        status: error.response.status
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        status: 0
      };
    }
  }
  
  // Default error message
  return {
    message: 'An unexpected error occurred',
    status: 500
  };
};