import clientPromise from "../lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { examAnswers } = body;
    const client = await clientPromise;
    const db = client.db("CaseData"); // Using your DB name "CaseData"
    const result = await db.collection("Exam").insertOne({
      examAnswers,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in /apiExam:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
