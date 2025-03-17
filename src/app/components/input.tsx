import React from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  type, 
  placeholder, 
  className, 
  value, 
  onChange, 
  required, 
  disabled 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  );
};

export default Input;
