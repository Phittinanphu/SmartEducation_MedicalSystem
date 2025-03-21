import React, { useEffect } from "react";
import TitleSection from "./Titles";
import FeatureSection from "./Feature";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";

const Home: React.FC = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Function to fetch UUID from database and set in cookies
    const fetchAndSetUUID = async () => {
      // Only fetch if user is authenticated
      if (status === 'authenticated' && session?.user) {
        try {
          // Check if we already have a cookie
          const existingCookie = Cookies.get('user_id');
          if (existingCookie) {
            console.log('User UUID already in cookie:', existingCookie);
            return;
          }
          
          // Fetch UUID from our API endpoint
          const response = await fetch('/api/get-user-uuid');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch UUID: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.uuid) {
            // Set the UUID in cookies
            Cookies.set('user_id', data.uuid, { 
              expires: 7, // Cookie expires in 7 days
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
            console.log('User UUID fetched from database and set in cookie:', data.uuid);
          } else {
            console.error('UUID not found in response:', data);
          }
        } catch (error) {
          console.error('Error fetching UUID:', error);
        }
      }
    };

    fetchAndSetUUID();
  }, [session, status]);

  return (
    <div>
      <Navbar />
      <TitleSection />
      <FeatureSection />
    </div>
  );
};

export default Home;


