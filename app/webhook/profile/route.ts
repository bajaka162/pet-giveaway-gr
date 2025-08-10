import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { webhookUrl, profileData } = await request.json()

  if (!webhookUrl || !profileData) {
    return NextResponse.json({ error: "Missing webhook URL or profile data" }, { status: 400 })
  }

  // Send to webhook
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to send webhook" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook request failed" }, { status: 500 })
  }
}
