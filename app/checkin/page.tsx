"use client";

import { motion } from "framer-motion";
import { MapPin, Zap, Gift, Info, MoveRight, Target } from "lucide-react";
import LocationChecker from "@/components/actions/LocationChecker";

export default function DemoCheckInPage() {
  return (
    <div className=" p-8">
      <LocationChecker />
    </div>
  );
}
