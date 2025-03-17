'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Cookies from 'js-cookie'

// Type definition for Google credentials
interface GoogleCredentials {
  name?: string
  email?: string
  picture?: string
  googleId?: string
  uuid?: string | null
}

// Type definition for hook return values
interface UseGoogleCredentialsReturn {
  googleCredentials: GoogleCredentials | null
  isAuthenticated: boolean
  isLoading: boolean
}

/**
 * Custom hook to get Google credentials including UUID
 * 
 * This hook provides access to the user's Google authentication data
 * including the UUID that was generated during authentication.
 * 
 * @returns {UseGoogleCredentialsReturn} Google credentials and authentication state
 */
export function useGoogleCredentials(): UseGoogleCredentialsReturn {
  const { data: session, status } = useSession()
  const [googleCredentials, setGoogleCredentials] = useState<GoogleCredentials | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Function to get credentials from both session and cookies
    const getCredentials = () => {
      // Check if authenticated with NextAuth
      if (status === 'authenticated' && session?.user) {
        // Get uuid from cookies if available
        const cookieUUID = Cookies.get('user_id')
        
        // Build credentials object
        const credentials: GoogleCredentials = {
          name: session.user.name,
          email: session.user.email,
          picture: session.user.image,
          googleId: session.user.id,
          uuid: session.user.uid || cookieUUID || null,
        }
        
        setGoogleCredentials(credentials)
        setIsAuthenticated(true)
        
        // Set UUID cookie if we have one in the session but not in cookies
        if (session.user.uid && !cookieUUID) {
          Cookies.set('user_id', session.user.uid, { 
            expires: 7, // Cookie expires in 7 days
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
        }
      } else {
        // Not authenticated with NextAuth, check cookie as fallback
        const cookieUUID = Cookies.get('user_id')
        
        if (cookieUUID) {
          // We have a UUID cookie but no session, user might be authenticated
          // in a different tab or through a different method
          setIsAuthenticated(true)
          setGoogleCredentials({ uuid: cookieUUID })
        } else {
          setIsAuthenticated(false)
          setGoogleCredentials(null)
        }
      }
      
      setIsLoading(false)
    }

    getCredentials()
  }, [session, status])

  return { googleCredentials, isAuthenticated, isLoading }
} 