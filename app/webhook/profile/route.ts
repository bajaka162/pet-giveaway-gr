export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { webhookUrl, profileData } = body

    if (!webhookUrl || !profileData) {
      return Response.json({ error: "Missing webhook URL or profile data" }, { status: 400 })
    }

    // Send to webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "🎮 New Roblox Profile Connected",
            color: 0x00ff00,
            fields: [
              {
                name: "👤 Username",
                value: `@${profileData.name}`,
                inline: true,
              },
              {
                name: "🏷️ Display Name",
                value: profileData.displayName,
                inline: true,
              },
              {
                name: "🆔 User ID",
                value: profileData.id.toString(),
                inline: true,
              },
              {
                name: "📅 Account Created",
                value: new Date(profileData.created).toLocaleDateString(),
                inline: true,
              },
              {
                name: "✅ Verified Badge",
                value: profileData.hasVerifiedBadge ? "Yes" : "No",
                inline: true,
              },
              {
                name: "🎭 Profile Type",
                value: profileData.isDemo ? "Demo Mode" : "Live Profile",
                inline: true,
              },
            ],
            description: profileData.description || "No description available",
            thumbnail: {
              url: profileData.avatar || "https://via.placeholder.com/100x100?text=Avatar",
            },
            timestamp: new Date().toISOString(),
            footer: {
              text: "Pet & Seed Store - Profile Connection",
            },
          },
        ],
      }),
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed: ${webhookResponse.status}`)
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ error: "Failed to send webhook" }, { status: 500 })
  }
}
