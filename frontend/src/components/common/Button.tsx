import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  label: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Allow custom class names for flexibility
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  type = 'button',
  className = '', 
  disabled = false, 
}) => {
  return (
    <button
      className={`w-full ${className}`} // Custom classes and hover effect
      type={type}
      onClick={onClick}
      disabled={disabled} 
      aria-label={label} 
    >
      {label}
    </button>
  );
};

export default Button;