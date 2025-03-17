/**
 * PostgreSQL Connection Utility
 * 
 * This module provides utility functions for connecting to PostgreSQL
 * and performing database operations including UUID generation.
 */

import { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'

// Create connection pool with proper SSL configuration for AWS RDS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
})

/**
 * Executes a PostgreSQL query with parameters
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount })
    }
    
    return res
  } catch (error) {
    console.error('Query error:', error.message, { text, params })
    throw error
  }
}

/**
 * Generates a UUID v4 for user identification
 * @returns {string} UUID v4 string
 */
export function generateUUID() {
  return uuidv4()
}

/**
 * Saves a Google user to the database with UUID
 * @param {Object} user - Google user data
 * @param {string} user.googleId - Google ID (sub from profile)
 * @param {string} user.email - User's email address
 * @param {string} user.firstName - User's first name
 * @param {string} user.lastName - User's last name
 * @returns {Promise<Object>} The saved user with UUID
 */
export async function saveGoogleUser(user) {
  // Check if user already exists
  const existingUser = await query(
    'SELECT * FROM userdata.google_accounts WHERE google_id = $1',
    [user.googleId]
  )
  
  if (existingUser.rows.length === 0) {
    // Create new user with UUID
    const uid = generateUUID()
    
    const result = await query(
      `INSERT INTO userdata.google_accounts 
       (google_id, email, first_name, last_name, last_login_at, uid) 
       VALUES ($1, $2, $3, $4, NOW(), $5)
       RETURNING *`,
      [user.googleId, user.email, user.firstName, user.lastName, uid]
    )
    
    return result.rows[0]
  } else {
    // Update existing user with UUID if it doesn't have one
    const currentUser = existingUser.rows[0]
    
    if (currentUser.uid) {
      // Just update login time
      const result = await query(
        'UPDATE userdata.google_accounts SET last_login_at = NOW() WHERE google_id = $1 RETURNING *',
        [user.googleId]
      )
      
      return result.rows[0]
    } else {
      // Update with new UUID
      const uid = generateUUID()
      
      const result = await query(
        'UPDATE userdata.google_accounts SET last_login_at = NOW(), uid = $2 WHERE google_id = $1 RETURNING *',
        [user.googleId, uid]
      )
      
      return result.rows[0]
    }
  }
}

/**
 * Gets a user by UUID
 * @param {string} uid - User's UUID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function getUserByUUID(uid) {
  const result = await query(
    'SELECT * FROM userdata.google_accounts WHERE uid = $1',
    [uid]
  )
  
  return result.rows[0] || null
}

/**
 * Gets a user by Google ID
 * @param {string} googleId - Google ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function getUserByGoogleId(googleId) {
  const result = await query(
    'SELECT * FROM userdata.google_accounts WHERE google_id = $1',
    [googleId]
  )
  
  return result.rows[0] || null
}

/**
 * Ensures all Google users have UUIDs
 * @returns {Promise<number>} Number of users updated with UUIDs
 */
export async function ensureAllUsersHaveUUIDs() {
  // Add UUID to any users that don't have one
  const result = await query(`
    UPDATE userdata.google_accounts 
    SET uid = gen_random_uuid() 
    WHERE uid IS NULL 
    RETURNING *
  `)
  
  return result.rowCount
}

export default pool 