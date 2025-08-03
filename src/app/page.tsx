"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Wallet, Trophy, Zap, Gift, Settings } from "lucide-react"

interface CoinAnimation {
  id: number
  x: number
  y: number
}

export default function TapToEarnApp() {
  const [coins, setCoins] = useState(0)
  const [energy, setEnergy] = useState(100)
  const [level, setLevel] = useState(1)
  const [coinsPerTap, setCoinsPerTap] = useState(1)
  const [coinAnimations, setCoinAnimations] = useState<CoinAnimation[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [dailyReward, setDailyReward] = useState(true)

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, 100))
    }, 3000) // Regenerate 1 energy every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Level up logic
  useEffect(() => {
    const newLevel = Math.floor(coins / 1000) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      setCoinsPerTap(newLevel)
    }
  }, [coins, level])

  // Clean up coin animations
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setCoinAnimations([])
    }, 1000)

    return () => clearTimeout(cleanup)
  }, [coinAnimations])

  const handleTap = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (energy > 0) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setCoins((prev) => prev + coinsPerTap)
      setEnergy((prev) => Math.max(prev - 1, 0))

      // Add coin animation
      const newAnimation: CoinAnimation = {
        id: Date.now() + Math.random(),
        x,
        y,
      }
      setCoinAnimations((prev) => [...prev, newAnimation])
    }
  }

  const connectWallet = () => {
    setIsConnected(true)
  }

  const claimDailyReward = () => {
    if (dailyReward) {
      setCoins((prev) => prev + 500)
      setDailyReward(false)
      // Reset daily reward after 24 hours (simplified to 10 seconds for demo)
      setTimeout(() => setDailyReward(true), 10000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-600">
            Level {level}
          </Badge>
          <Button
            size="sm"
            variant={isConnected ? "secondary" : "default"}
            onClick={connectWallet}
            className="flex items-center gap-1"
          >
            <Wallet className="w-4 h-4" />
            {isConnected ? "Connected" : "Connect"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card className="bg-black/30 border-purple-500/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-300">Energy</p>
                <Progress value={energy} className="w-full h-2 mt-1" />
                <p className="text-xs text-gray-400 mt-1">{energy}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-purple-500/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-300">Per Tap</p>
                <p className="text-lg font-bold text-yellow-400">+{coinsPerTap}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tap Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <Button
          onClick={handleTap}
          disabled={energy === 0}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-700 shadow-2xl transform transition-all duration-150 active:scale-95 relative overflow-hidden"
        >
          <Coins className="w-20 h-20" />

          {/* Coin animations */}
          {coinAnimations.map((animation) => (
            <div
              key={animation.id}
              className="absolute pointer-events-none animate-bounce"
              style={{
                left: animation.x - 10,
                top: animation.y - 10,
                animation: "float-up 1s ease-out forwards",
              }}
            >
              <span className="text-yellow-300 font-bold text-lg">+{coinsPerTap}</span>
            </div>
          ))}
        </Button>

        {energy === 0 && (
          <div className="absolute bottom-4 text-center">
            <p className="text-red-400 font-semibold">Energy depleted!</p>
            <p className="text-sm text-gray-400">Wait for energy to regenerate</p>
          </div>
        )}
      </div>

      {/* Daily Reward */}
      {dailyReward && (
        <div className="p-4">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-green-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Daily Reward Available!</p>
                    <p className="text-sm opacity-90">Claim 500 coins</p>
                  </div>
                </div>
                <Button
                  onClick={claimDailyReward}
                  variant="secondary"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-black/20 backdrop-blur-sm">
        <Button variant="ghost" className="flex flex-col gap-1 h-auto py-3">
          <Coins className="w-5 h-5" />
          <span className="text-xs">Earn</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 h-auto py-3">
          <Wallet className="w-5 h-5" />
          <span className="text-xs">Wallet</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 h-auto py-3">
          <Settings className="w-5 h-5" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
      `}</style>
    </div>
  )
}
