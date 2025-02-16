import React from "react";
import Background from "../components/submit/Background";
import SubmitInstructions from "../components/submit/SubmitInstructions";
import Navbar2 from "../components/Navbar2";

const Page = () => {
  return (
    <div className="relative w-full h-screen">
      <Navbar2 />
      <Background>
        <SubmitInstructions />
      </Background>
    </div>
  );
};

export default Page;

