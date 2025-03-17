import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool, { query, generateUUID } from '@/app/lib/postgresql';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * NextAuth.js Configuration
 * 
 * Environment Variables Required:
 * ------------------------------
 * NEXTAUTH_URL=http://localhost:3000 (or your production URL)
 * NEXTAUTH_SECRET=your_nextauth_secret_key (generate with `openssl rand -base64 32`)
 * 
 * Google OAuth Credentials:
 * ------------------------
 * GOOGLE_CLIENT_ID=your_google_client_id 
 * GOOGLE_CLIENT_SECRET=your_google_client_secret
 * 
 * To get Google OAuth credentials:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project (or select existing one)
 * 3. Go to "APIs & Services" > "Credentials"
 * 4. Click "Create Credentials" > "OAuth client ID"
 * 5. Set up the consent screen if prompted
 * 6. Select "Web application" as the application type
 * 7. Add authorized redirect URIs:
 *    - http://localhost:3000/api/auth/callback/google (for development)
 *    - https://yourdomain.com/api/auth/callback/google (for production)
 * 8. Copy the generated Client ID and Client Secret to your .env file
 */

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          );
          
          const user = result.rows[0];
          
          if (!user) {
            return null;
          }
          
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            return null;
          }
          
          return {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            studentId: user.student_id,
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && profile) {
        if (account.provider === 'google') {
          // Store the UUID from Google sign-in in the token
          token.uid = profile.uid;
          token.googleId = profile.sub;
        }
      }
      
      if (user) {
        token.id = user.id;
        token.studentId = user.studentId;
        // Ensure any uid from user object is in the token
        if (user.uid) {
          token.uid = user.uid;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Add the user ID and student ID to the session
        session.user.id = token.id;
        session.user.studentId = token.studentId;
        
        // Add the UUID from the token to the session
        if (token.uid) {
          session.user.uid = token.uid;
        }
        if (token.googleId) {
          session.user.googleId = token.googleId;
        }
        
        // Set cookie here to ensure it's always set immediately
        // This won't work directly here - we'll add client-side code
      }
      return session;
    },
    async signIn({ account, profile, user }) {
      if (account.provider === 'google') {
        try {
          // Start a transaction
          const client = await pool.connect();
          try {
            await client.query('BEGIN');

            // Check if user exists in users table
            const existingUser = await client.query(
              'SELECT * FROM users WHERE email = $1',
              [profile.email]
            );
            
            let userId;
            if (existingUser.rows.length === 0) {
              // Create new user in users table
              const names = profile.name.split(' ');
              const firstName = names[0] || '';
              const lastName = names.slice(1).join(' ') || '';
              
              const newUser = await client.query(
                'INSERT INTO users (first_name, last_name, email, password, student_id, dob) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [firstName, lastName, profile.email, '', '', '1900-01-01']
              );
              userId = newUser.rows[0].id;
            } else {
              userId = existingUser.rows[0].id;
            }

            // Check if Google account exists
            const existingGoogleAccount = await client.query(
              'SELECT * FROM userdata.google_accounts WHERE google_id = $1',
              [profile.sub]
            );

            if (existingGoogleAccount.rows.length === 0) {
              // Generate a UUID for the new Google account
              const uid = generateUUID();
              console.log('Generated new UUID:', uid);
              
              // Create new Google account with UUID
              const result = await client.query(
                `INSERT INTO userdata.google_accounts 
                (google_id, email, first_name, last_name, last_login_at, uid) 
                VALUES ($1, $2, $3, $4, NOW(), $5)
                RETURNING *`,
                [profile.sub, profile.email, profile.given_name, profile.family_name, uid]
              );
              
              // Add the UUID to the profile and user objects
              profile.uid = uid;
              if (user) user.uid = uid;
              
              // Implement special handling for first-time login
              // Store as a JWT cookie with httpOnly: false so client JS can access
              // This won't work directly here - we'll add client-side code
              
              console.log('Created new Google account with UUID:', uid);
            } else {
              // Get the existing UUID
              const googleAccount = existingGoogleAccount.rows[0];
              const uid = googleAccount.uid;
              
              console.log('Found existing Google account with UUID:', uid);
              
              // Update last login time
              await client.query(
                'UPDATE userdata.google_accounts SET last_login_at = NOW() WHERE google_id = $1',
                [profile.sub]
              );
              
              // Add the UUID to the profile and user objects
              profile.uid = uid;
              if (user) user.uid = uid;
            }

            await client.query('COMMIT');
            return true;
          } catch (error) {
            await client.query('ROLLBACK');
            throw error;
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      
      return true;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };

