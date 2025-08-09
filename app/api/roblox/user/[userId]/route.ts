import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    // Fetch from Roblox API
    const response = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      id: data.id,
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      created: data.created,
      isBanned: data.isBanned,
      externalAppDisplayName: data.externalAppDisplayName,
      hasVerifiedBadge: data.hasVerifiedBadge,
      isDemo: false,
    })
  } catch (error) {
    console.error("Roblox user API error:", error)
    return NextResponse.json({ error: "API request failed" }, { status: 500 })
  }
}
