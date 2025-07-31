"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Gift,
  Star,
  Zap,
  QrCode,
  Video,
  MapPin,
  Play,
  Scan,
  Plus,
} from "lucide-react";
import { useRewards } from "@/hooks/useRewards";
import { generateRandomReward } from "@/lib/utils";
import { playUISound } from "@/lib/sounds";
import { ActionType } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Gift className="w-12 h-12 " />
        </motion.div>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Welcome to Real Mint
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Collect unique digital rewards by scanning codes, watching videos, and
          checking in at locations.
        </p>
      </div>
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6  cursor-pointer shadow-2xl border border-blue-500/20"
        >
          <Link href="/product" className="block">
            <div className="flex items-center justify-between mb-4">
              <QrCode className="w-8 h-8" />
              <div className="w-12 h-12 /20 rounded-xl flex items-center justify-center">
                <Scan className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Scan Codes</h3>
            <p className="text-blue-100 mb-4">
              Scan QR codes to unlock rewards instantly
            </p>
            <div className="text-sm text-blue-100 font-semibold">
              ✨ Available Now!
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6  cursor-pointer shadow-2xl border border-purple-500/20"
        >
          <Link href="/watch" className="block">
            <div className="flex items-center justify-between mb-4">
              <Video className="w-8 h-8" />
              <div className="w-12 h-12 /20 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Watch Videos</h3>
            <p className="text-purple-100 mb-4">
              Watch videos for 15+ seconds to earn rewards
            </p>
            <div className="text-sm text-purple-100 font-semibold">
              ✨ Available Now!
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6  cursor-pointer shadow-2xl border border-green-500/20"
        >
          <Link href="/checkin" className="block">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8" />
              <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Check-in</h3>
            <p className="text-green-100 mb-4">
              Visit locations and check in to collect rewards
            </p>
            <div className="text-sm text-green-100 font-semibold">
              ✨ Available Now!
            </div>
          </Link>
        </motion.div>

    
      </div>
    </div>
  );
}
