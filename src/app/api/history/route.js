import { NextResponse } from 'next/server'
import pool from '../../lib/postgres'

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json(
      { error: 'UID parameter is required' },
      { status: 400 }
    )
  }

  try {
    const client = await pool.connect()
    
    try {
      // Get instances where owner = uid, including name and symptom fields
      const result = await client.query(
        `SELECT 
          case_id, 
          profile, 
          disease, 
          created_at, 
          done,
          name,
          symptom
        FROM 
          userdata.instances 
        WHERE 
          owner = $1
        ORDER BY 
          created_at DESC`,
        [uid]
      )
      
      // Return the instances
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error in GET /api/history:', error)
    
    // Handle specific errors
    if (error.code === '42P01') {
      return NextResponse.json(
        { error: 'Database table not found. Please check schema configuration.' },
        { status: 500 }
      )
    } else if (error.code === 'ECONNREFUSED' || error.code === '57P01') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check configuration.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
} 