import clientPromise from "../lib/mongodb";

// GET handler to fetch exam answers
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("CaseData");
    // Fetch exam records sorted by creation time descending
    const exams = await db.collection("Exam").find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, data: exams || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /apiExam:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST handler to save exam answers
export async function POST(request) {
  try {
    const body = await request.json();
    const { examAnswers } = body;
    const client = await clientPromise;
    const db = client.db("CaseData");
    const result = await db.collection("Exam").insertOne({
      examAnswers,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /apiExam:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
