"use client";

import PatientHistory from "../components/PatientHistory";
import TitleSection from "../components/Titles";
import Navbar from "../components/Navbar2";
import { SessionProvider } from "next-auth/react";


export default function Page() {
  return (
    <SessionProvider>
      <div className="bg-[#0f172a] min-h-screen">
        <Navbar />
        <TitleSection />
        <div className="container mx-auto">
          <PatientHistory />
        </div>
    </div>
    </SessionProvider>
  );
}
