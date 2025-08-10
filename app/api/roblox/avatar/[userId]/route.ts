import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params

    // Fetch Roblox avatar data
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch avatar" }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Invalid user ID or request failed" }, { status: 400 })
  }
}
