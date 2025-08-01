"use client";

import { motion } from "framer-motion";
import {
  Gift,
  QrCode,
  Video,
  MapPin,
  Play,
  Scan,
  Plus,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      {/* Welcome Section */}
      <div className="text-center py-12">
        <motion.div className="w-24 h-24   flex items-center justify-center mx-auto mb-6 ">
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
        {/* Scan Codes */}
        <motion.div className="bg-gradient-to-br hover:scale-105 transition-all duration-100 from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700 rounded-2xl p-6 cursor-pointer shadow-xl border border-sky-500/20">
          <Link href="/product" className="block">
            <div className="flex items-center justify-between mb-4">
              <QrCode className="w-8 h-8 text-white" />
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Scan className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Scan Codes
            </h3>
            <p className="mb-4 text-white/90">
              Scan QR codes to unlock rewards instantly
            </p>
            <div className="text-sm font-semibold text-white">
              ✨ Available Now!
            </div>
          </Link>
        </motion.div>

        {/* Watch Videos */}
        <motion.div className="bg-gradient-to-br hover:scale-105 transition-all duration-100 from-fuchsia-500 to-purple-600 dark:from-fuchsia-600 dark:to-indigo-700 rounded-2xl p-6 cursor-pointer shadow-xl border border-purple-500/20">
          <Link href="/watch" className="block">
            <div className="flex items-center justify-between mb-4">
              <Video className="w-8 h-8 text-white" />
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Watch Videos
            </h3>
            <p className="mb-4 text-white/90">
              Watch videos for 15+ seconds to earn rewards
            </p>
            <div className="text-sm font-semibold text-white">
              ✨ Available Now!
            </div>
          </Link>
        </motion.div>

        {/* Check-in */}
        <motion.div className="bg-gradient-to-br hover:scale-105 transition-all duration-100 from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-2xl p-6 cursor-pointer shadow-xl border border-emerald-500/20">
          <Link href="/checkin" className="block">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8 text-white" />
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Check-in</h3>
            <p className="mb-4 text-white/90">
              Visit locations and check in to collect rewards
            </p>
            <div className="text-sm font-semibold text-white">
              ✨ Available Now!
            </div>
          </Link>
        </motion.div>

        {/* Documentation */}
        <motion.div className="bg-gradient-to-br hover:scale-105 transition-all duration-100 from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 rounded-2xl p-6 cursor-pointer shadow-xl border border-blue-500/20">
          <Link href="/docs" className="block">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-white" />
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Documentation
            </h3>
            <p className="mb-4 text-white/90">
              Learn how to use all features and get help
            </p>
            <div className="text-sm font-semibold text-white">
              📚 Help & Guides
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
