"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Gift,
  Zap,
  CheckCircle,
  Target,
  Globe,
  Smartphone,
  Award,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function LocationAboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br  rounded-xl">
            <MapPin className="w-8 h-8 " />
          </div>
          <h1 className="text-4xl font-bold">Location Check-in</h1>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience our reward system by checking in at nearby locations using
          your real GPS location
        </p>

        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold ">8</div>
            <div className="text-sm text-muted-foreground">
              Locations Generated
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">Real GPS</div>
            <div className="text-sm text-muted-foreground">Location Based</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">Unique</div>
            <div className="text-sm text-muted-foreground">Digital Badges</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Demo CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r rounded-xl p-8 text-center "
      >
        <h2 className="text-2xl font-bold mb-4">
          Interactive Location Check-in - Try it now!
        </h2>
        <p className="text-purple-100 mb-6">
          Explore our location-based reward system with real GPS coordinates
        </p>
        <Link
          href="/checkin"
          className="inline-flex items-center gap-2 px-6 py-3  rounded-lg font-semibold  transition-colors"
        >
          <Navigation className="w-5 h-5" />
          Explore
        </Link>
      </motion.div>

      {/* How it Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          How Location Check-in Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-card rounded-xl p-6 border text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className=" font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Enable Location Access
            </h3>
            <p className="text-muted-foreground">
              Grant location permissions to access your GPS coordinates and
              generate nearby locations
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card rounded-xl p-6 border text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className=" font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Find Generated Locations
            </h3>
            <p className="text-muted-foreground">
              Browse fake locations generated around your real GPS position with
              real-time distance updates
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card rounded-xl p-6 border text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className=" font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Check In & Earn Rewards
            </h3>
            <p className="text-muted-foreground">
              When you&rsquo;re within range of a location, tap &ldquo;Check
              In&rdquo; to earn unique digital badges and build your collection
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Globe className="w-6 h-6 " />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Real-time Location Tracking
              </h3>
              <p className="text-muted-foreground">
                Get accurate distance updates and location status in real-time
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <Smartphone className="w-6 h-6 " />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Real GPS Required</h3>
              <p className="text-muted-foreground">
                Uses your actual GPS coordinates to generate realistic check-in
                locations around your position
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3  rounded-lg">
              <Award className="w-6 h-6 " />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Unique Digital Badges
              </h3>
              <p className="text-muted-foreground">
                Collect rare and legendary rewards for each location you visit
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Users className="w-6 h-6 " />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Social Experience</h3>
              <p className="text-muted-foreground">
                Share your achievements and compete with friends for the best
                collection
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold">Ready to Start Collecting?</h2>
        <p className="text-muted-foreground">
          Enable location access and start earning rewards at nearby locations
        </p>
        <Link
          href="/checkin"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600  rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <MapPin className="w-5 h-5" />
          Start Location Check-in
        </Link>
      </motion.div>
    </div>
  );
}
