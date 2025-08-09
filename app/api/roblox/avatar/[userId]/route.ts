import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    // Fetch from Roblox API
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch avatar" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.data || [],
    })
  } catch (error) {
    console.error("Roblox avatar API error:", error)
    return NextResponse.json({ error: "API request failed" }, { status: 500 })
  }
}
