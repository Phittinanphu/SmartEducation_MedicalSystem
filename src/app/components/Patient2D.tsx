import React from "react";

const Patient2D = ({ text }: { text: string }) => {
  return (
    <div className="patient-container">
      {/* ✅ โหลดทุกส่วนของร่างกาย */}
      <img src="/patient/torso.png" className="part torso" />
      <img src="/patient/head.png" className="part head" />
      <img src="/patient/mouth.png" className={`part mouth ${text ? "talking" : ""}`} />
      <img src="/patient/arms.png" className="part arms" />
      <img src="/patient/leg.png" className="part leg" /> {/* ตรวจสอบชื่อไฟล์ให้ตรงกัน */}

      <style jsx>{`
        .patient-container {
          position: relative;
          width: 300px;
          height: 600px;
        }
        .part {
          position: absolute;
          width: 100%;
        }
        .head { 
          top: 0; 
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
        }
        .torso { 
          top: 100px; 
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
        }
        .arms { 
          top: 120px; 
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
        }
        .legs { 
          top: 300px; 
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
        }
        .mouth {
          top: 65%;
          left: 50%;
          width: 50px;
          height: 20px;
          transition: transform 0.2s;
        }
        .talking {
          animation: talk 0.2s infinite alternate;
        }
        @keyframes talk {
          from { transform: scaleY(1); }
          to { transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  );
};

export default Patient2D;
