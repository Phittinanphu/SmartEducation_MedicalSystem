# Medical Website Google Authentication Implementation

This document outlines the implementation of Google Authentication for the Medical Website for Medical Students built with Next.js and PostgreSQL.

## Implementation Overview

The Google Authentication system has been fully implemented using NextAuth.js with PostgreSQL as the database backend. This implementation provides secure authentication for medical students and faculty, ensuring proper data privacy and security.

## Database Schema

The authentication system uses two main tables:

1. **users** - Stores basic user information
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     student_id TEXT NOT NULL,
     dob DATE NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **userdata.google_accounts** - Stores Google-specific authentication data
   ```sql
   CREATE SCHEMA IF NOT EXISTS userdata;
   
   CREATE TABLE IF NOT EXISTS userdata.google_accounts (
     id SERIAL PRIMARY KEY,
     google_id VARCHAR(255) UNIQUE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     first_name VARCHAR(255),
     last_name VARCHAR(255),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     last_login_at TIMESTAMP WITH TIME ZONE,
     FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
   );
   ```

## Authentication Flow

1. **User Flow**:
   - User clicks "Sign in with Google" on login or signup page
   - Google OAuth consent screen is displayed
   - User grants permission
   - User is redirected back to the application
   - Application creates/updates user records in database
   - User is redirected to the main dashboard

2. **Technical Flow**:
   - NextAuth.js handles OAuth 2.0 flow with Google
   - Google profile information is received
   - A database transaction ensures both `users` and `google_accounts` tables are updated
   - Session is established with JWT
   - Protected routes are enforced through middleware

## Configuration

### Environment Variables

The following environment variables are required:

```env
# Base NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/medwebsite
# Alternative database configuration
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medwebsite
DB_SSL=false
```

### Google Developer Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to "APIs & Services" > "Credentials"
4. Configure OAuth consent screen
   - Add required app information
   - Add scopes: `openid`, `profile`, `email`
5. Create OAuth client ID credentials
   - Application type: Web application
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your .env file

## Verification

You can verify the Google Authentication implementation by:

1. Accessing the `/auth-verify` page which runs tests on:
   - NextAuth Session
   - Database table existence
   - Google Account data retrieval
   
2. Visiting the `/profile` page after authentication to see:
   - Basic user information
   - Google account details
   - Last login timestamp

## File Structure

Key files in the implementation:

```
/src
  /app
    /api
      /auth
        /[...nextauth]
          /route.js     # NextAuth configuration
    /components
      /login.tsx        # Login component with Google Sign-In
      /signup.tsx       # Signup component with Google Sign-In
    /lib
      /postgres.js      # Database setup and queries
      /auth-utils.js    # Authentication utility functions
    /profile
      /page.tsx         # User profile page
    /auth-verify
      /page.tsx         # Authentication verification page
  /middleware.ts        # Route protection middleware
```

## Security Considerations

1. **Database Security**:
   - Foreign key constraints ensure data integrity
   - Password fields never store Google-related passwords

2. **Authentication Security**:
   - JWT-based sessions with secure settings
   - HTTPS enforced in production
   - OAuth 2.0 best practices followed

3. **User Data Privacy**:
   - Only essential user data is stored
   - Google tokens are not persisted in the database

## Troubleshooting

If you encounter issues:

1. Check environment variables are properly set
2. Verify Google OAuth credentials are correct
3. Ensure database connection is working
4. Visit `/auth-verify` page to run diagnostics
5. Check server logs for detailed error messages

## Credits

Implementation by [Your Name/Team] using:
- Next.js
- NextAuth.js
- PostgreSQL
- TypeScript
