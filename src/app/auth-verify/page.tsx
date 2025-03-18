'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { verifyAuthentication, getGoogleAccountData } from '../lib/auth-utils';
import { query } from '../lib/postgres';
import { Session } from 'next-auth';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: Record<string, unknown> | Error | null;
}

export default function AuthVerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function runTests() {
      const results: TestResult[] = [];
      
      // Test 1: Verify NextAuth Session
      try {
        const authSession = await verifyAuthentication() as Session | null;
        results.push({
          name: 'NextAuth Session',
          success: !!authSession,
          message: authSession ? 'Session is active' : 'No active session found',
          details: authSession ? { 
            user: authSession.user,
            expires: authSession.expires 
          } : null
        });
      } catch (error) {
        results.push({
          name: 'NextAuth Session',
          success: false,
          message: 'Error checking session',
          details: error as Error
        });
      }
      
      // Test 2: Verify users table exists
      try {
        const usersTableResult = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'users'
          );
        `);
        
        const usersTableExists = usersTableResult.rows[0].exists;
        results.push({
          name: 'Users Table',
          success: usersTableExists,
          message: usersTableExists ? 'Users table exists' : 'Users table does not exist'
        });
      } catch (error) {
        results.push({
          name: 'Users Table',
          success: false,
          message: 'Error checking users table',
          details: error
        });
      }
      
      // Test 3: Verify google_accounts table exists
      try {
        const googleTableResult = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'userdata' AND table_name = 'google_accounts'
          );
        `);
        
        const googleTableExists = googleTableResult.rows[0].exists;
        results.push({
          name: 'Google Accounts Table',
          success: googleTableExists,
          message: googleTableExists ? 'Google accounts table exists in userdata schema' : 'Google accounts table does not exist in userdata schema'
        });
      } catch (error) {
        results.push({
          name: 'Google Accounts Table',
          success: false,
          message: 'Error checking Google accounts table',
          details: error
        });
      }
      
      // Test 4: Check for Google user data if user is authenticated
      if (session?.user?.email) {
        try {
          const googleData = await getGoogleAccountData(session.user.email);
          results.push({
            name: 'Google Account Data',
            success: !!googleData,
            message: googleData ? 'Found Google account data' : 'No Google account data found for this user',
            details: googleData || undefined
          });
        } catch (error) {
          results.push({
            name: 'Google Account Data',
            success: false,
            message: 'Error checking Google account data',
            details: error
          });
        }
      }
      
      setTestResults(results);
      setLoading(false);
    }
    
    runTests();
  }, [session]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-4">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Google Authentication Verification</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
          <p className="mt-4 text-gray-600">Running authentication tests...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Google Authentication Verification</h2>
          <p className="text-gray-600">Testing the implementation of Google authentication</p>
        </div>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Test Results</h3>
            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{test.name}</h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      test.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {test.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-gray-700">{test.message}</p>
                  {test.details && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        <pre>{JSON.stringify(test.details, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => router.push('/profile')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold transition hover:bg-blue-700"
            >
              Go to Profile
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white py-2 px-4 rounded-md font-semibold transition hover:bg-gray-700"
            >
              Run Tests Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 