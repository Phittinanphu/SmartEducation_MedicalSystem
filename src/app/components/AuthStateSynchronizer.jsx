'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Cookies from 'js-cookie'

/**
 * AuthStateSynchronizer Component
 * 
 * This component synchronizes authentication state between NextAuth session,
 * cookies, and sessionStorage. It should be included on pages that require
 * authentication to ensure the UID is properly stored after navigation.
 * 
 * Usage: 
 * - Include this component in layout files or on individual authenticated pages
 * - <AuthStateSynchronizer />
 */
export default function AuthStateSynchronizer() {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    // Function to sync auth state
    const syncAuthState = async () => {
      try {
        // Skip if not authenticated
        if (status !== 'authenticated' || !session?.user) {
          return
        }
        
        // Check for UID in session
        const sessionUid = session.user.uid
        
        // Check existing cookie
        const cookieUid = Cookies.get('user_id')
        
        // Set UUID cookie if we have one in the session but not in cookies
        if (sessionUid && !cookieUid) {
          // Store in cookie
          Cookies.set('user_id', sessionUid, {
            expires: 7, // 7 days
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          
          // Also store in sessionStorage for faster access
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('user_uuid', sessionUid)
            sessionStorage.setItem('has_logged_in_before', 'true')
          }
          
          console.log('Auth synchronized: Set UID in cookie and sessionStorage')
        }
        
        // If we still don't have the UID in session but have a Google ID,
        // fetch it from server
        if (!sessionUid && (session.user.googleId || session.user.id || session.user.email)) {
          try {
            const response = await fetch('/api/get-user-uuid')
            
            if (response.ok) {
              const data = await response.json()
              
              if (data.uuid) {
                Cookies.set('user_id', data.uuid, {
                  expires: 7,
                  path: '/',
                  secure: process.env.NODE_ENV === 'production', 
                  sameSite: 'strict'
                })
                
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('user_uuid', data.uuid)
                  sessionStorage.setItem('has_logged_in_before', 'true')
                }
                
                console.log('Auth synchronized: Retrieved and set UID from server')
              }
            }
          } catch (error) {
            console.error('Error fetching UID from server:', error)
          }
        }
      } catch (error) {
        console.error('Error synchronizing authentication state:', error)
      }
    }
    
    // Run synchronization
    syncAuthState()
  }, [session, status])
  
  // This component doesn't render anything
  return null
} 