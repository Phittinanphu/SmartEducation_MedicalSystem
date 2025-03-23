import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Add this to suppress pg-native module warnings
// Disable native client attempt to avoid warnings
pg.defaults.parseInt8 = true;

// Configure PostgreSQL connection pool
const pool = new pg.Pool({
  // Use connection string if provided, otherwise use individual connection parameters
  connectionString: process.env.DATABASE_URL,
  // If no connection string is provided, use these parameters
  user: !process.env.DATABASE_URL ? process.env.DB_USER : undefined,
  host: !process.env.DATABASE_URL ? process.env.DB_HOST : undefined,
  database: !process.env.DATABASE_URL
    ? process.env.DB_NAME || process.env.DB_DATABASE || "medwebsite"
    : undefined,
  password: !process.env.DATABASE_URL ? process.env.DB_PASSWORD : undefined,
  port: !process.env.DATABASE_URL
    ? process.env.DB_PORT
      ? parseInt(process.env.DB_PORT)
      : 5432
    : undefined,
  max: 10, // Max connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  // Enable SSL for production/cloud connections
  ssl:
    process.env.NODE_ENV === "production" || process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

// Log connection events
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

// Function to execute SQL queries
async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Function to create necessary tables if they don't exist
export async function initializeTables() {
  try {
    // Create userdata schema if it doesn't exist
    await query(`
      CREATE SCHEMA IF NOT EXISTS userdata;
    `);

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        student_id TEXT NOT NULL,
        dob DATE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create google_accounts table in userdata schema
    await query(`
      CREATE TABLE IF NOT EXISTS userdata.google_accounts (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
      );
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
}

// Function to get a user by email
async function getUserByEmail(email) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

// Function to create a new user
async function createUser(userData) {
  const { firstName, lastName, studentId, dob, email, password } = userData;

  const result = await query(
    "INSERT INTO users (first_name, last_name, student_id, dob, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [firstName, lastName, studentId, dob, email, password]
  );

  return result.rows[0];
}

// Function to get a user by ID
async function getUserById(id) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

// Function to update a user
async function updateUser(id, userData) {
  const { firstName, lastName, studentId, dob, email } = userData;

  const result = await query(
    "UPDATE users SET first_name = $1, last_name = $2, student_id = $3, dob = $4, email = $5 WHERE id = $6 RETURNING *",
    [firstName, lastName, studentId, dob, email, id]
  );

  return result.rows[0];
}

// Function to delete a user
async function deleteUser(id) {
  await query("DELETE FROM users WHERE id = $1", [id]);
  return { success: true };
}

// Initialize tables when the module is imported
initializeTables().catch(console.error);

// Export the pool as default export
export default pool;

// Named exports for selected functions (initializeTables is exported inline)
export {
  query,
  getUserByEmail,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
