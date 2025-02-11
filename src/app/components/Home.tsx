import React from "react";
import TitleSection from "./Titles";
import FeatureSection from "./Feature";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <TitleSection />
      <FeatureSection />
    </div>
  );
};

export default Home;


