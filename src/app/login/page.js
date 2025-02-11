// navbar.tsx

import React from "react";
import { Link } from "react-router-dom"; // ใช้สำหรับลิงก์ใน React Router
import LoginPage from "./login"; // นำเข้า LoginPage จาก login.js

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link> {/* ลิงก์ไปยังหน้า Login */}
        </li>
      </ul>

      {/* หากอยู่ในหน้า login ให้แสดง LoginPage */}
      <Route path="/login" component={LoginPage} />
    </nav>
  );
};

export default Navbar;
