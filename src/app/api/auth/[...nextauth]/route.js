import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool, { query } from '@/app/lib/postgres';
import bcrypt from 'bcryptjs';

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.studentId = user.studentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.studentId = token.studentId;
      }
      return session;
    },
    async signIn({ account, profile }) {
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
            
            if (existingUser.rows.length === 0) {
              // Create new user in users table
              const names = profile.name.split(' ');
              const firstName = names[0] || '';
              const lastName = names.slice(1).join(' ') || '';
              
              await client.query(
                'INSERT INTO users (first_name, last_name, email, password, student_id, dob) VALUES ($1, $2, $3, $4, $5, $6)',
                [firstName, lastName, profile.email, '', '', '1900-01-01']
              );
            }

            // Check if Google account exists
            const existingGoogleAccount = await client.query(
              'SELECT * FROM userdata.google_accounts WHERE google_id = $1',
              [profile.sub]
            );

            if (existingGoogleAccount.rows.length === 0) {
              // Create new Google account
              await client.query(
                `INSERT INTO userdata.google_accounts 
                (google_id, email, first_name, last_name, last_login_at) 
                VALUES ($1, $2, $3, $4, NOW())`,
                [profile.sub, profile.email, profile.given_name, profile.family_name]
              );
            } else {
              // Update last login time
              await client.query(
                'UPDATE userdata.google_accounts SET last_login_at = NOW() WHERE google_id = $1',
                [profile.sub]
              );
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

