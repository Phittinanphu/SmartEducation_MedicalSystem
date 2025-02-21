// src/app/api/chat/route.js
import clientPromise from "../lib/mongodb";

export async function POST(request) {
  const body = await request.json();
  const { chatHistory } = body;
  try {
    const client = await clientPromise;
    const db = client.db("SmartEducation_MedicalSystem"); // Replace with your actual DB name
    const result = await db.collection("chats").insertOne({
      chatHistory,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
