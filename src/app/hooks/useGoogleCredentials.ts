'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Cookies from 'js-cookie'

/**
 * GoogleCredentials type definition
 */
export type GoogleCredentials = {
  name: string | null
  email: string | null
  picture: string | null
  googleId: string | null
  uuid: string | null
}

/**
 * Return type for useGoogleCredentials hook
 */
export type UseGoogleCredentialsReturn = {
  googleCredentials: GoogleCredentials | null
  isAuthenticated: boolean
  isLoading: boolean
  refreshCredentials: () => Promise<void>
}

/**
 * Custom hook to get Google credentials including UUID
 * 
 * This hook provides access to the user's Google authentication data
 * including the UUID that was generated during authentication.
 * Enhanced to ensure UUID is always available for first-time logins.
 * 
 * @returns {UseGoogleCredentialsReturn} Google credentials and authentication state
 */
export function useGoogleCredentials(): UseGoogleCredentialsReturn {
  const { data: session, status } = useSession()
  const [googleCredentials, setGoogleCredentials] = useState<GoogleCredentials | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Check if this is a first-time login by looking for a flag in sessionStorage
  const isFirstTimeLogin = () => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('has_logged_in_before')
  }

  // Mark that the user has logged in before
  const markAsLoggedInBefore = () => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('has_logged_in_before', 'true')
  }

  // Fetch UUID from server if not available in session
  const fetchUUIDFromServer = async (googleId, email) => {
    try {
      // Call your API endpoint that retrieves UUID based on Google ID or email
      const response = await fetch('/api/get-user-uuid')
      
      if (!response.ok) {
        console.error('Failed to fetch UUID from server:', await response.text())
        return null
      }
      
      const data = await response.json()
      return data.uuid || null
    } catch (error) {
      console.error('Error fetching UUID from server:', error)
      return null
    }
  }

  // Store UUID in both cookie and sessionStorage
  const storeUUID = (uuid) => {
    if (!uuid) return false
    
    try {
      // Set in cookie with secure settings for medical data
      Cookies.set('user_id', uuid, { 
        expires: 7, // Cookie expires in 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      // Also store in sessionStorage as backup/for faster access
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user_uuid', uuid)
      }
      
      console.log('Successfully stored UUID in cookie and sessionStorage:', uuid)
      return true
    } catch (error) {
      console.error('Error storing UUID:', error)
      return false
    }
  }

  // Comprehensive function to get the UUID from all possible sources
  const getUUID = async (): Promise<string | null> => {
    // Check sources in order of preference
    
    // 1. From session if available
    if (session?.user?.uid) {
      return session.user.uid
    }
    
    // 2. From cookie if available
    const cookieUUID = Cookies.get('user_id')
    if (cookieUUID) {
      return cookieUUID
    }
    
    // 3. From sessionStorage if available
    if (typeof window !== 'undefined') {
      const sessionUUID = sessionStorage.getItem('user_uuid')
      if (sessionUUID) {
        return sessionUUID
      }
    }
    
    // 4. As last resort, fetch from server if we have identifiers
    if (session?.user?.id || session?.user?.email) {
      return await fetchUUIDFromServer(session.user.id, session.user.email)
    }
    
    return null
  }

  // Function to refresh credentials - can be called from components when needed
  const refreshCredentials = async () => {
    setIsLoading(true)
    await updateCredentials()
    setIsLoading(false)
  }

  // The main function to update credentials with all available data
  const updateCredentials = async () => {
    // Check if authenticated with NextAuth
    if (status === 'authenticated' && session?.user) {
      // Get UUID from all possible sources
      const uuid = await getUUID()
      
      // Build credentials object
      const credentials: GoogleCredentials = {
        name: session.user.name || null,
        email: session.user.email || null,
        picture: session.user.image || null,
        googleId: session.user.id || null,
        uuid: uuid,
      }
      
      setGoogleCredentials(credentials)
      setIsAuthenticated(true)
      
      // Always store UUID if we have it (handles first-time login case)
      if (uuid) {
        storeUUID(uuid)
        markAsLoggedInBefore()
      }
      
      return credentials
    }
    
    setIsAuthenticated(false)
    setGoogleCredentials(null)
    return null
  }

  // Effect to run on mount and session change
  useEffect(() => {
    const initializeCredentials = async () => {
      setIsLoading(true)
      await updateCredentials()
      setIsLoading(false)
    }
    
    initializeCredentials()
  }, [session, status])

  // Return the hook values
  return {
    googleCredentials,
    isAuthenticated,
    isLoading,
    refreshCredentials
  }
} 