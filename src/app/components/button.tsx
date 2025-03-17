import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  onClick, 
  type = 'button',
  disabled
}) => {
  return (
    <button 
      type={type}
      className={`bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
