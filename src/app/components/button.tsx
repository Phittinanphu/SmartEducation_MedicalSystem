import React from "react";

const Button = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <button className={`bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
