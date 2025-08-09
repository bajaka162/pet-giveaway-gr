import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const cleanUsername = username.trim()

    // Try the official Roblox API first
    const response = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(cleanUsername)}&limit=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Origin: "https://www.roblox.com",
          Referer: "https://www.roblox.com/",
        },
      },
    )

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Real Roblox API success:", data)
      return NextResponse.json({ ...data, isDemo: false })
    }

    // If that fails, try the username lookup endpoint
    const usernameResponse = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        usernames: [cleanUsername],
        excludeBannedUsers: true,
      }),
    })

    if (usernameResponse.ok) {
      const usernameData = await usernameResponse.json()
      console.log("✅ Real Roblox username API success:", usernameData)
      return NextResponse.json({ data: usernameData.data || [], isDemo: false })
    }

    console.log("⚠️ Roblox API failed, using demo mode")

    // Only use demo mode as last resort
    return NextResponse.json({
      data: [
        {
          id: Math.floor(Math.random() * 1000000),
          name: cleanUsername,
          displayName: cleanUsername,
          hasVerifiedBadge: false,
        },
      ],
      isDemo: true,
    })
  } catch (error) {
    console.error("❌ API Error:", error)

    // Return demo data only on error
    return NextResponse.json({
      data: [
        {
          id: Math.floor(Math.random() * 1000000),
          name: username.trim(),
          displayName: username.trim(),
          hasVerifiedBadge: false,
        },
      ],
      isDemo: true,
    })
  }
}
