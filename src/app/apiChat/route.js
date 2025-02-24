import clientPromise from "../lib/mongodb";

// GET handler to fetch chat history
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("CaseData");
    // Fetch chat records sorted by creation time descending
    const chats = await db.collection("Chat").find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, data: chats || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /apiChat:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST handler to save chat history
export async function POST(request) {
  try {
    const body = await request.json();
    const { chatHistory } = body;
    const client = await clientPromise;
    const db = client.db("CaseData");
    const result = await db.collection("Chat").insertOne({
      chatHistory,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /apiChat:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
