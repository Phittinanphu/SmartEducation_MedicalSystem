import React from "react";
import Link from "next/link"; // ใช้ Link จาก Next.js

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/" legacyBehavior>
            <a>Home</a> {/* ใช้ <a> tag ภายใน Link */}
          </Link>
        </li>
        <li>
          <Link href="/login" legacyBehavior>
            <a>Login</a> {/* ใช้ <a> tag ภายใน Link */}
          </Link>
        </li>

        {/* เพิ่มลิงค์ไปยังหน้า Sign Up */}
        <li>
          <Link href="/signup" legacyBehavior>
            <a>Sign Up</a> {/* ใช้ <a> tag ภายใน Link */}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
