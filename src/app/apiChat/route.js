import pool from "../lib/postgres";
import { NextResponse } from "next/server";

// GET handler to fetch chat history
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM chat_logs.chat ORDER BY createdAt DESC");
    client.release();

    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /apiChat:", error);
    
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

// POST handler to save chat history
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body || !body.chatHistory) {
      return NextResponse.json({
        success: false,
        error: "Missing required field: chatHistory"
      }, { status: 400 });
    }
    
    const { chatHistory } = body;
    
    // Validate that chatHistory is an array
    if (!Array.isArray(chatHistory)) {
      return NextResponse.json({
        success: false,
        error: "chatHistory must be an array"
      }, { status: 400 });
    }
    
    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO chat_logs.Chat (chatHistory, createdAt) VALUES ($1, $2) RETURNING *",
      [JSON.stringify(chatHistory), new Date()]
    );
    client.release();

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /apiChat:", error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: "This chat history record already exists."
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
