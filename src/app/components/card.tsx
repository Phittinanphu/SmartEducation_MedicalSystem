import React from "react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-4 bg-white rounded-lg shadow ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export default Card;
