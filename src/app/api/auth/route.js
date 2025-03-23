import { NextResponse } from "next/server";

/**
 * Handler for GET requests to fetch user session
 */
export async function GET() {
  try {
    const session = await verifyAuthentication();

    if (!session) {
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 401 }
      );
    }

    // Return user data without exposing sensitive information
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    });
  } catch (error) {
    console.error("Error in auth API:", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    );
  }
}

/**
 * Handler for POST requests to handle logout
 */
export async function POST(request) {
  const { action } = await request.json();

  if (action === "logout") {
    try {
      // Handle logout on server side
      // We can't use the exact same logoutUser function because it uses router
      // which is client-side only, but we can perform the server-side part

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error in logout API:", error);
      return NextResponse.json({ error: "Logout error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
