"use client";

import { motion } from "framer-motion";
import { MapPin, Zap, Gift, Info, MoveRight, Target } from "lucide-react";
import LocationChecker from "@/components/actions/LocationChecker";

export default function DemoCheckInPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}

        {/* Main Demo Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LocationChecker />
        </motion.div>

        {/* Footer Space */}
        <div className="h-8" />
      </div>
    </div>
  );
}
