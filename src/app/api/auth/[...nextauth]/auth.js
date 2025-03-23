/**
 * NextAuth configuration options
 *
 * This configuration sets up Google OAuth authentication and
 * handles UUID generation for PostgreSQL storage.
 */
export const authOptions = {
  providers: [
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Request additional profile fields that we'll need for our database
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    }),

    // ... other providers ...
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          // Save the Google user to our database with UUID generation
          const savedUser = await saveGoogleUser({
            googleId: profile.sub,
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
          });

          // Add the UUID to the user object for token generation
          user.uid = savedUser.uid;

          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          // Add these fields from the user profile to the JWT token
          uid: user.uid,
          googleId: user.id,
          provider: account.provider,
        };
      }

      // On subsequent requests, check if the UUID is still valid and the user exists in our database
      if (token.googleId) {
        try {
          const userFromDB = await getUserByGoogleId(token.googleId);

          if (!userFromDB) {
            // If the user no longer exists in our database, force re-authentication
            return { ...token, error: "UserNotFound" };
          }

          // Ensure token has the latest UUID
          if (userFromDB.uid && userFromDB.uid !== token.uid) {
            token.uid = userFromDB.uid;
          }
        } catch (error) {
          console.error("Error fetching user for JWT refresh:", error);
          // Don't invalidate the token on DB errors
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom claims to the session including UUID
      if (token) {
        session.user.uid = token.uid;
        session.user.googleId = token.googleId;
        session.user.provider = token.provider;

        // If token has an error, add it to the session
        if (token.error) {
          session.error = token.error;
        }
      }

      return session;
    },
  },
  // ... rest of configuration ...
};
