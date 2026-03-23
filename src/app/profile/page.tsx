"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getGoogleAccountData,
  isGoogleUser,
  logoutUser,
} from "../lib/auth-utils";
import Image from "next/image";
import { getFullUrl } from "../utils/navigation";

interface GoogleAccountData {
  id: number;
  google_id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  last_login_at: string;
  uid: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [googleData, setGoogleData] = useState<GoogleAccountData | null>(null);
  const [isGoogle, setIsGoogle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push(getFullUrl("/login"));
      return;
    }

    async function fetchData() {
      if (session?.user?.email) {
        // Check if user is Google authenticated
        const googleUser = await isGoogleUser(session.user.email);
        setIsGoogle(googleUser);

        if (googleUser) {
          // Fetch Google account data
          const data = await getGoogleAccountData(session.user.email);
          setGoogleData(data as GoogleAccountData);
        }
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-blue-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser(router);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Smart Healthcare Assistant"
            width={64}
            height={64}
            className="mx-auto h-16 w-16"
          />
          <h2 className="mt-4 text-2xl font-bold">User Profile</h2>
          <p className="text-gray-600">Your account information</p>
        </div>

        {session?.user && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
              </div>
            </div>

            {isGoogle && googleData && (
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Google Account Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Google ID</p>
                    <p className="font-medium text-xs truncate">
                      {googleData.google_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">UUID</p>
                    <p className="font-medium text-xs truncate">
                      {googleData.uid || "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-medium">
                      {googleData.last_login_at
                        ? new Date(googleData.last_login_at).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">
                      {new Date(googleData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Authentication</p>
                    <p className="font-medium text-green-600">Google</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Account Actions
              </h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => router.push(getFullUrl("/main"))}
                  className="bg-blue-600 text-white py-2 rounded-md font-semibold transition hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white py-2 rounded-md font-semibold transition hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
