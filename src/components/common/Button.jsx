import React from 'react';
import './Button.css';
import { useTheme } from '@context/ThemeContext'; // assumes themeColor is provided here
import { Spinner } from 'react-bootstrap';

export default function Button({
  type = 'button',
  label,
  onClick,
  className = '',
  variant = 'solid', // 'solid' | 'outline'
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  iconLeft,
  iconRight,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  ...rest
}) {
  const { themeColor } = useTheme();

  return (
    <button
      type={type}
      className={`
        btn-custom 
        btn-${variant}-${themeColor} 
        btn-${size} 
        ${fullWidth ? 'w-100' : ''} 
        d-flex align-items-center justify-content-center gap-2
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" animation="border" />
      ) : (
        <>
          {iconLeft && <span>{iconLeft}</span>}
          <span>{label}</span>
          {iconRight && <span>{iconRight}</span>}
        </>
      )}
    </button>
  );
}
