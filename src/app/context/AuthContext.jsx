'use client'

import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { getFullUrl } from "../utils/navigation"

/**
 * Authentication Context
 * 
 * Provides authentication state and functions to components throughout the application.
 * Handles user session, login state, and logout functionality.
 */
export const AuthContext = createContext()

export function AuthProvider({ children }) {
	const router = useRouter()
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	// Initialize auth state on mount
	useEffect(() => {
		async function loadUserFromSession() {
			try {
				setLoading(true)
				
				// Use API endpoint instead of direct DB calls
				const response = await fetch('/api/auth')
				const data = await response.json()
				
				if (data.isAuthenticated && data.user) {
					setUser(data.user)
				} else {
					setUser(null)
				}
			} catch (error) {
				console.error('Error loading user session:', error)
				setUser(null)
			} finally {
				setLoading(false)
			}
		}

		loadUserFromSession()
	}, [])

	/**
	 * Logs out the current user
	 */
	const handleLogout = async () => {
		try {
			// First, notify the server about logout
			await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ action: 'logout' })
			})
			
			// Then use next-auth signOut
			await signOut({ redirect: false })
			
			// Update local state
			setUser(null)
			
			// Redirect to login
			router.push(getFullUrl('/login'))
		} catch (error) {
			console.error('Error in logout:', error)
			// Force redirect to login even if there's an error
			router.push(getFullUrl('/login'))
		}
	}

	/**
	 * Checks if user is authenticated
	 */
	const checkAuth = async () => {
		try {
			const response = await fetch('/api/auth')
			const data = await response.json()
			return data.isAuthenticated
		} catch (error) {
			console.error('Error checking authentication:', error)
			return false
		}
	}

	// Context value
	const value = {
		user,
		loading,
		isAuthenticated: !!user,
		logout: handleLogout,
		checkAuth
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 