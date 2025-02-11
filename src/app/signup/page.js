import React from "react";
import { Link } from "react-router-dom";  // ถ้าคุณใช้ React Router
import Signup from "../components/signup";  // Import ไฟล์ signup.js

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        {/* หรือถ้าคุณจะใช้ปุ่มเพื่อแสดง Signup */}
        {/* <button onClick={() => setShowSignup(true)}>Sign Up</button> */}
      </ul>
      {/* หากใช้ปุ่มแสดง Signup */}
      {/* {showSignup && <Signup />} */}
    </nav>
  );
};

export default Navbar;
