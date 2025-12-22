import React from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

export interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  reverseOrder?: boolean;
  toastOptions?: {
    duration?: number;
    style?: React.CSSProperties;
    className?: string;
    success?: {
      duration?: number;
      icon?: React.ReactNode;
    };
    error?: {
      duration?: number;
      icon?: React.ReactNode;
    };
    loading?: {
      duration?: number;
      icon?: React.ReactNode;
    };
  };
}

export const Toaster: React.FC<ToasterProps> = ({
  position = 'top-right',
  reverseOrder = false,
  toastOptions = {
    duration: 4000,
    success: {
      duration: 2000,
    },
    error: {
      duration: 4000,
    },
  },
}) => {
  return (
    <HotToaster
      position={position}
      reverseOrder={reverseOrder}
      toastOptions={toastOptions}
    />
  );
};