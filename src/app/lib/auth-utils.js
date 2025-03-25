"use client";

/**
 * Authentication Utilities
 *
 * This file contains utility functions for working with authentication
 * and Google sign-in in the medical website application.
 */

import { getSession, signOut } from "next-auth/react";
import { query } from "./postgres";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getFullUrl } from "../utils/navigation";

/**
 * Verifies if a user is authenticated
 * @returns {Promise<object|null>} User session data or null if not authenticated
 */
export async function verifyAuthentication() {
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return null;
  }
}

/**
 * Gets the Google account data for a user
 * @param {string} email - User's email
 * @returns {Promise<object|null>} Google account data or null if not found
 */
export async function getGoogleAccountData(email) {
  try {
    const result = await query(
      "SELECT *, uid::text AS uid FROM userdata.google_accounts WHERE email = $1",
      [email]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching Google account data:", error);
    return null;
  }
}

/**
 * Updates the last login time for a Google user
 * @param {string} googleId - Google ID of the user
 * @returns {Promise<boolean>} Whether the update was successful
 */
export async function updateGoogleLoginTimestamp(googleId) {
  try {
    await query(
      "UPDATE userdata.google_accounts SET last_login_at = NOW() WHERE google_id = $1",
      [googleId]
    );
    return true;
  } catch (error) {
    console.error("Error updating login timestamp:", error);
    return false;
  }
}

/**
 * Logs out the current user and redirects to login page
 * @param {object} router - Next.js router instance
 * @returns {Promise<void>}
 */
export async function logoutUser(router) {
  try {
    await signOut({ redirect: false });
    router.push(getFullUrl("/login"));
  } catch (error) {
    console.error("Error during logout:", error);
    // Force redirect to login even if there's an error
    router.push(getFullUrl("/login"));
  }
}

/**
 * Checks if user is a Google authenticated user
 * @param {string} email - User's email
 * @returns {Promise<boolean>} Whether user is Google authenticated
 */
export async function isGoogleUser(email) {
  try {
    const result = await query(
      "SELECT COUNT(*) FROM userdata.google_accounts WHERE email = $1",
      [email]
    );

    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking if user is Google authenticated:", error);
    return false;
  }
}

/**
 * Custom hook to handle authentication state
 * @returns {object} Auth state with user and loading status
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const loading = status === "loading";

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  return { user, loading };
}

/**
 * Extract user profile information from the user object
 * @param {object} user - User object from session
 * @returns {object} Formatted user profile
 */
export function getUserProfile(user) {
  if (!user) return null;

  return {
    id: user.id || user.sub || "Not available",
    name:
      user.name ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Not available",
    email: user.email || "Not available",
    googleId: user.googleId || user.sub || null,
    provider: user.provider || (user.sub ? "Google" : "Email/Password"),
  };
}
