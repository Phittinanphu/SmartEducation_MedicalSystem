import { NextResponse } from 'next/server'
import pool from '../../lib/postgres'

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    )
  }

  try {
    const client = await pool.connect()
    
    try {
      // Get user by email
      const result = await client.query(
        'SELECT * FROM userdata.google_accounts WHERE email = $1',
        [email]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      
      // Return the user data including uid
      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error in GET /api/user:', error)
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
} 