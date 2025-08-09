import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    // Fetch from Roblox API
    const response = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to search user" }, { status: response.status })
    }

    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: data.data,
      isDemo: false,
    })
  } catch (error) {
    console.error("Roblox search API error:", error)
    return NextResponse.json({ error: "API request failed" }, { status: 500 })
  }
}
