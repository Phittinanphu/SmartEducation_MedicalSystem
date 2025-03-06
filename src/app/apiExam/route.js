import pool from "../lib/postgres";
import { NextResponse } from "next/server";

// GET handler to fetch exam answers
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM chat_logs.Exam ORDER BY createdAt DESC");
    client.release();

    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /apiExam:", error);
    
    // Handle specific database errors
    if (error.code === 'ECONNREFUSED' || error.code === '57P01') {
      return NextResponse.json({
        success: false,
        error: "Database connection failed. Please check your database configuration."
      }, { status: 503 });
    } else if (error.code === '42P01') {
      return NextResponse.json({
        success: false,
        error: "Table does not exist. Please check database schema."
      }, { status: 500 });
    }
    
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST handler to save exam answers
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body || !body.examAnswers) {
      return NextResponse.json({
        success: false,
        error: "Missing required field: examAnswers"
      }, { status: 400 });
    }
    
    const { examAnswers } = body;
    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO chat_logs.Exam (examAnswers, createdAt) VALUES ($1, $2) RETURNING *",
      [JSON.stringify(examAnswers), new Date()]
    );
    client.release();

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /apiExam:", error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: "This exam record already exists."
      }, { status: 409 });
    } else if (error.code === '42P01') {
      return NextResponse.json({
        success: false,
        error: "Table does not exist. Please check database schema."
      }, { status: 500 });
    } else if (error.code === 'ECONNREFUSED' || error.code === '57P01') {
      return NextResponse.json({
        success: false,
        error: "Database connection failed. Please check your database configuration."
      }, { status: 503 });
    }
    
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
