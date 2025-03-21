import { NextResponse } from 'next/server'
import { getUserByGoogleId, getUserByEmail } from '@/app/lib/postgresql'
import { getServerSession } from 'next-auth/next'

/**
 * GET request handler to fetch a user's UUID from the database
 * This endpoint requires authentication and returns the user's UUID
 */
export async function GET(request) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if we have enough user data to query with
    const { email, id: googleId } = session.user
    
    if (!email && !googleId) {
      return NextResponse.json(
        { error: 'Insufficient user data to query UUID' },
        { status: 400 }
      )
    }
    
    // First try to get user by Google ID if available
    let user = null
    if (googleId) {
      user = await getUserByGoogleId(googleId)
    }
    
    // If not found by Google ID, try by email
    if (!user && email) {
      // This assumes you have a function to get user by email
      // If not, you can modify the getUserByGoogleId function logic
      user = await getUserByEmail(email)
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }
    
    // Return the UUID
    return NextResponse.json({ uuid: user.uid })
  } catch (error) {
    console.error('Error fetching user UUID:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 