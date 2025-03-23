import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool, { initializeTables as createTables } from "@/app/lib/postgres";

// Ensure the tables exist
createTables();

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to validate the input fields
function validateInput(data) {
  const { firstName, lastName, studentId, email, password } = data;

  if (!firstName || !lastName || !studentId || !email || !password) {
    return { valid: false, message: "All fields are required" };
  }

  if (firstName.length < 2 || lastName.length < 2) {
    return {
      valid: false,
      message: "First and last name must be at least 2 characters long",
    };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }

  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  return { valid: true };
}

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();

    // Validate the input fields
    const validation = validateInput(data);
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const { firstName, lastName, studentId, email, password } = data;

    // Check if the user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, student_id, email, password, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, first_name, last_name, email`,
      [firstName, lastName, studentId, email, hashedPassword]
    );

    // Return the newly created user (excluding the password)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
