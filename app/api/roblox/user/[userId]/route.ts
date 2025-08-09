import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Origin: "https://www.roblox.com",
        Referer: "https://www.roblox.com/",
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Real user data fetched:", data)
      return NextResponse.json({ ...data, isDemo: false })
    }

    console.log("⚠️ User API failed, using demo data")

    // Return demo data only if real API fails
    return NextResponse.json({
      id: Number.parseInt(userId),
      name: `User${userId}`,
      displayName: `User${userId}`,
      description: "Real API unavailable - demo profile",
      created: "2020-01-01T00:00:00.000Z",
      isBanned: false,
      hasVerifiedBadge: false,
      isDemo: true,
    })
  } catch (error) {
    console.error("❌ User API Error:", error)

    return NextResponse.json({
      id: Number.parseInt(userId),
      name: `User${userId}`,
      displayName: `User${userId}`,
      description: "API connection failed - demo profile",
      created: "2020-01-01T00:00:00.000Z",
      isBanned: false,
      hasVerifiedBadge: false,
      isDemo: true,
    })
  }
}
