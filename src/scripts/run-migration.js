/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script to run the UUID migration for Google accounts
 *
 * This script reads the migration SQL and executes it against the database
 */

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Create a PostgreSQL connection pool with proper SSL configuration for AWS RDS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("Starting UUID migration for Google accounts...");

    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "../app/db/migrations/add_uuid_to_google_accounts.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Execute the migration
    await client.query(migrationSQL);

    console.log("UUID migration completed successfully!");

    // Check the updated table structure
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'userdata' AND table_name = 'google_accounts'
    `);

    console.log("Current google_accounts table columns:");
    result.rows.forEach((row) => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });

    // Check for existing records and their UUIDs
    const users = await client.query(
      "SELECT google_id, email, uid FROM userdata.google_accounts LIMIT 5"
    );

    console.log("\nSample Google accounts with UUIDs:");
    if (users.rows.length === 0) {
      console.log("No Google accounts found in the database.");
    } else {
      users.rows.forEach((user) => {
        console.log(`- Google ID: ${user.google_id}, Email: ${user.email}`);
        console.log(`  UUID: ${user.uid || "Not set"}`);
      });
    }
  } catch (error) {
    console.error("Error running UUID migration:", error.message);

    if (
      error.message.includes(
        'relation "userdata.google_accounts" does not exist'
      )
    ) {
      console.error("\nThe userdata.google_accounts table does not exist.");
      console.error(
        "Make sure you have created the table before running this migration."
      );
    }
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration();
