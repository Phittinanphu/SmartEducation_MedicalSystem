import React, { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/submit-background.png')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative flex justify-center items-center h-full">
        {children}
      </div>
    </div>
  );
};

export default Background;



