import PatientHistory from "../components/PatientHistory";
import TitleSection from "../components/Titles";
import Navbar from "../components/Navbar2";

export default function Page() {
  return (
    <div>
      <Navbar />
      <TitleSection />
      <div className="container mx-auto p-6">
        <PatientHistory />
      </div>
    </div>
  );
}
