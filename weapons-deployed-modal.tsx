"use client"

import { useState } from "react"
import { Check, X, Zap, Shield, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Component() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Show Weapons Deployed Modal
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      {/* Modal overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-300 tracking-wide">Legend/</h2>
              <div className="text-sm text-slate-500">live Activity</div>
            </div>

            {/* Success icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                <Check className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Main message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white">Weapons Deployed!</h1>
              <p className="text-slate-300">
                Successfully transferred <span className="text-green-400 font-semibold">6 weapons</span> to:
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xl font-bold text-blue-400">#54</div>
              </div>
            </div>

            {/* Status message */}
            <div className="text-sm text-slate-400 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              Arsenal transfer complete
            </div>

            {/* Weapon icons */}
            <div className="flex justify-center space-x-4 pt-2">
              <div className="w-8 h-8 bg-slate-700/50 rounded border border-slate-600/50 flex items-center justify-center">
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="w-8 h-8 bg-slate-700/50 rounded border border-slate-600/50 flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-400" />
              </div>
              <div className="w-8 h-8 bg-slate-700/50 rounded border border-slate-600/50 flex items-center justify-center">
                <Target className="h-4 w-4 text-red-400" />
              </div>
            </div>

            {/* Action button */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Continue Mission
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
