import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Configure PostgreSQL connection pool
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  max: 10, // Max connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
});

// Export a function to get the pool (same as clientPromise in MongoDB)
export default pool;
