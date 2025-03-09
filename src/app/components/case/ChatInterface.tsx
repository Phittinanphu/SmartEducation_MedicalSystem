import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PatientModel from "../components/PatientModel";

const ChatInterface = () => {
  const [speech, setSpeech] = useState("");

  const handleSpeak = (text: string) => {
    setSpeech(text);
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* ส่วนแชท */}
      <div style={{ flex: 1, padding: "20px", background: "#f4f4f4" }}>
        <h2>Chat Interface</h2>
        <button onClick={() => handleSpeak("I can respond to your voice!")}>
          Speak
        </button>
      </div>

      {/* ส่วนโมเดล 3D */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <PatientModel speech={speech} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default ChatInterface;
