"use client";

import { motion } from "framer-motion";
import { MapPin, Zap, Gift, Info, MoveRight, Target } from "lucide-react";
import DemoLocationSystem from "@/components/actions/LocationChecker";

export default function DemoCheckInPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MapPin className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Location Check-in Demo
          </h1>
          
          <p className="text-lg max-w-2xl mx-auto mb-4">
            Experience our reward system by checking in at nearby locations
          </p>

          {/* Demo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800"
          >
            <Target className="w-4 h-4" />
            Interactive Demo - Try it now!
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <motion.div 
            className="rounded-xl shadow-lg border p-6 text-center"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm mb-1">Explore</p>
            <p className="text-2xl font-bold">16+</p>
            <p className="text-xs opacity-70">Locations Available</p>
          </motion.div>

          <motion.div 
            className="rounded-xl shadow-lg border p-6 text-center"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm mb-1">Check-in</p>
            <p className="text-2xl font-bold">Instant</p>
            <p className="text-xs opacity-70">Reward System</p>
          </motion.div>

          <motion.div 
            className="rounded-xl shadow-lg border p-6 text-center"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm mb-1">Collect</p>
            <p className="text-2xl font-bold">Unique</p>
            <p className="text-xs opacity-70">Digital Badges</p>
          </motion.div>
        </motion.div>

        {/* Enhanced How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl shadow-lg border p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">
              How the Demo Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">
                Enable Location or Use Demo Mode
              </h3>
              <p className="text-sm opacity-70">
                Grant location access for the full experience, or try our demo mode to simulate being near locations
              </p>
              <div className="hidden md:block absolute top-8 -right-4 transform">
                <MoveRight className="w-6 h-6 opacity-50" />
              </div>
            </motion.div>

            <motion.div 
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">
                Find Available Locations
              </h3>
              <p className="text-sm opacity-70">
                Browse nearby locations and see real-time distance updates. Demo locations appear around your position
              </p>
              <div className="hidden md:block absolute top-8 -right-4 transform">
                <MoveRight className="w-6 h-6 opacity-50" />
              </div>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">
                Check In & Earn Rewards
              </h3>
              <p className="text-sm opacity-70">
                When you&apos;re within range, tap &quot;Check In&quot; to earn unique digital badges and build your collection
              </p>
            </motion.div>
          </div>

          {/* Demo Features Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
              ✨ Demo Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-purple-700 dark:text-purple-300">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Simulate being at any location</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Real-time distance tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>Instant reward feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Dynamic location generation</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Demo Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DemoLocationSystem />
        </motion.div>

        {/* Additional Demo Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
            💡 Demo Tips for Best Experience
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div className="space-y-2">
              <h4 className="font-medium">If you have location access:</h4>
              <ul className="space-y-1 pl-4">
                <li>• Demo locations will appear around your position</li>
                <li>• Distance tracking updates in real-time</li>
                <li>• Try the &quot;Simulate Near Location&quot; feature</li>
                <li>• Check the proximity progress bars</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">If location is blocked:</h4>
              <ul className="space-y-1 pl-4">
                <li>• Use &quot;Demo Mode&quot; to simulate positions</li>
                <li>• Pre-defined demo locations are available</li>
                <li>• All features work without real GPS</li>
                <li>• Perfect for testing the system</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> This demo uses simulated locations and reduced cooldowns for testing purposes. 
              In a production app, locations would be real venues and businesses.
            </p>
          </div>
        </motion.div>

        {/* Footer Space */}
        <div className="h-8" />
      </div>
    </div>
  );
}