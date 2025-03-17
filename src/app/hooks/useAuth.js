'use client'

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Custom hook to use authentication context
 * 
 * Provides easy access to the authentication state and methods
 * throughout the application. Handles errors if used outside
 * of AuthProvider.
 * 
 * @returns {Object} Authentication context values and methods
 */
export function useAuth() {
	const context = useContext(AuthContext)
	
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	
	return context
} 