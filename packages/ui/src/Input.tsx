import React from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className, ...props }, ref) => {
    return (
      <div className={classNames('form-group', { 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={props.id} className="label block mb-1 sm:mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={classNames(
            'input text-base sm:text-lg',
            { 'border-red-500': error },
            className
          )}
          {...props}
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
