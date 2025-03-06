// eslint-disable-next-line @typescript-eslint/no-require-imports
const pool = require("../lib/postgres")

// GET handler to fetch exam answers
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM chat_logs.Exam ORDER BY createdAt DESC");
    client.release();

    return new Response(JSON.stringify({ success: true, data: result.rows }), {
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
    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO Exam (examAnswers, createdAt) VALUES ($1, $2) RETURNING *",
      [JSON.stringify(examAnswers), new Date()]
    );
    client.release();

    return new Response(JSON.stringify({ success: true, data: result.rows[0] }), {
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
