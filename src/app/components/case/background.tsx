// Background.tsx
import React, { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{
      backgroundImage: `url('/chatbackground.png')`,
    }}>
      <div className="absolute inset-0 bg-gray-900 bg-opacity-40"></div>
      {children}
    </div>
  );
};

export default Background;