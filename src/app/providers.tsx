'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import AuthStateSynchronizer to avoid SSR issues
// since it uses client-side only features like cookies and sessionStorage
const AuthStateSynchronizer = dynamic(
  () => import('./components/AuthStateSynchronizer'),
  { ssr: false }
)

interface ProvidersProps {
  children: ReactNode
}

/**
 * Global providers for the application
 * 
 * Includes:
 * - NextAuth SessionProvider for authentication
 * - AuthStateSynchronizer to ensure UID is properly stored in cookies
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <AuthStateSynchronizer />
    </SessionProvider>
  )
} 