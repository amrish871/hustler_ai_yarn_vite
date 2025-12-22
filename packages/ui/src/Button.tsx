import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = ({
  label,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...rest
}: ButtonProps) => {
  const baseClasses = clsx(
    'btn hover-lift',
    {
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-outline': variant === 'outline',
      'w-full': fullWidth,
      'px-2.5 py-1.5 text-xs': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
      'animate-spin': rest.disabled, // Add loading spinner effect when disabled
    },
    className
  );

  return (
    <button className={baseClasses} {...rest}>
      {children ?? label}
    </button>
  );
}
