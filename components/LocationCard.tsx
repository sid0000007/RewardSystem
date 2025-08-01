"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  CheckCircle,
  Clock,
  Ruler,
  Gift,
  ExternalLink,
  Target,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { LocationData, Coordinates } from "@/types";
import { formatDistance, getRewardRarity } from "@/lib/utils";
import { getDistanceToLocation } from "@/data/locations";
import { Badge } from "./ui/badge";
import { getRarityColor, getStatusStyles } from "@/lib/getbgColour";

interface EnhancedLocationCardProps {
  location: LocationData;
  userCoordinates?: Coordinates | null;
  isCheckedIn?: boolean;
  isWithinRange?: boolean;
  onCheckIn?: (locationId: string) => void;
  onGetDirections?: (location: LocationData) => void;
  className?: string;
  showCheckInButton?: boolean;
  isCheckingIn?: boolean;
}

export default function EnhancedLocationCard({
  location,
  userCoordinates,
  isCheckedIn = false,
  isWithinRange = false,
  onCheckIn,
  onGetDirections,
  className = "",
  showCheckInButton = true,
  isCheckingIn = false,
}: EnhancedLocationCardProps) {

  const distance = userCoordinates
    ? getDistanceToLocation(userCoordinates, location.coordinates)
    : null;

  // Calculate proximity percentage (0-100%)
  const proximityPercentage =
    distance !== null
      ? Math.max(
          0,
          Math.min(100, ((location.radius - distance) / location.radius) * 100)
        )
      : 0;

  // Determine card status
  const getCardStatus = () => {
    if (isCheckedIn) return "checked-in";
    if (isWithinRange) return "available";
    if (distance !== null && distance <= location.radius * 2) return "nearby";
    if (distance !== null && distance <= location.radius * 5) return "distant";
    return "far";
  };

  const cardStatus = getCardStatus();

  const handleCheckIn = () => {
    if (onCheckIn && isWithinRange && !isCheckedIn) {
      onCheckIn(location.id);
    }
  };

  const handleGetDirections = () => {
    if (onGetDirections) {
      onGetDirections(location);
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.latitude},${location.coordinates.longitude}`;
      window.open(url, "_blank");
    }
  };


  const statusStyles = getStatusStyles(cardStatus);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative group
        rounded-lg shadow-lg hover:shadow-xl
        ${statusStyles.border} ${statusStyles.bg}
        overflow-hidden        
        ${className}
      `}
    >
      {/* Proximity Progress Bar */}
      {distance !== null && !isCheckedIn && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${proximityPercentage}%` }}
            className={`h-full transition-all duration-500 ${
              isWithinRange
                ? "bg-success"
                : proximityPercentage > 50
                ? "bg-primary"
                : proximityPercentage > 25
                ? "bg-warning"
                : "bg-destructive"
            }`}
          />
        </div>
      )}

      {/* Rarity Border Glow */}
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-r ${
          location.reward.type === "legendary"
            ? "from-yellow-400 via-yellow-500 to-orange-500"
            : location.reward.type === "epic"
            ? "from-purple-400 via-purple-500 to-pink-500"
            : location.reward.type === "rare"
            ? "from-blue-400 via-blue-500 to-cyan-500"
            : location.reward.type === "special"
            ? "from-pink-400 via-pink-500 to-rose-500"
            : "from-muted via-muted to-muted"
        } opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative z-10 p-6">
        {/* Location Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
              {location.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {location.description}
            </p>
          </div>
        </div>

        {/* Enhanced Location Info */}
        <div className="space-y-3 mb-4">
          {/* Distance with visual indicator */}
          {distance !== null && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="w-4 h-4" />
                <span>{formatDistance(distance)} away</span>
              </div>

              {/* Distance status badge */}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isWithinRange
                    ? "bg-success/10 text-success"
                    : distance <= location.radius * 2
                    ? "bg-warning/10 text-warning"
                    : "bg-muted/10 text-muted-foreground"
                }`}
              >
                {isWithinRange
                  ? "🎯 In Range"
                  : distance <= location.radius * 2
                  ? "🚶 Close"
                  : "🗺️ Far"}
              </span>
            </div>
          )}

          {/* Check-in Radius with visual indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{formatDistance(location.radius)} check-in radius</span>
            </div>

            {/* Radius visualization */}
            {distance !== null && (
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden ml-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    isWithinRange ? "bg-success" : "bg-warning"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (location.radius / Math.max(distance, location.radius)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Enhanced Reward Info */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {location.reward.name}
              </span>
            </div>

            <Badge
              variant="secondary"
              className={`${getRarityColor(
                location.reward.type
              )} text-xs font-semibold rounded-sm w-18`}
            >
              {location.reward.type}
            </Badge>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex gap-2">
          {showCheckInButton && (
            <motion.button
              whileHover={{
                scale:
                  isWithinRange && !isCheckedIn && !isCheckingIn ? 1.05 : 1,
              }}
              whileTap={{
                scale:
                  isWithinRange && !isCheckedIn && !isCheckingIn ? 0.95 : 1,
              }}
              onClick={handleCheckIn}
              disabled={!isWithinRange || isCheckedIn || isCheckingIn}
              className={`
                flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                ${
                  isCheckingIn
                    ? "bg-primary/80 text-primary-foreground cursor-not-allowed"
                    : isCheckedIn
                    ? "bg-success/10 text-success border border-success cursor-not-allowed"
                    : isWithinRange
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed border"
                }
              `}
            >
              {isCheckingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking In...
                </>
              ) : isCheckedIn ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Checked In
                </>
              ) : isWithinRange ? (
                <>
                  <Zap className="w-4 h-4" />
                  Check In Now!
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Get Closer (
                  {formatDistance(
                    Math.max(0, (distance || 0) - location.radius)
                  )}{" "}
                  to go)
                </>
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetDirections}
            className="px-4 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2 border"
            title="Get directions"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Directions</span>
          </motion.button>
        </div>

        {/* Enhanced Status Messages */}
        {!userCoordinates && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <p className="text-xs text-warning">
                Enable location access to see distance and check-in status
              </p>
            </div>
          </div>
        )}

        {userCoordinates &&
          distance !== null &&
          distance > location.radius &&
          !isCheckedIn && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-warning" />
                  <p className="text-xs text-warning">
                    Move {formatDistance(distance - location.radius)} closer to
                    check in
                  </p>
                </div>
                {distance <= location.radius * 2 && (
                  <span className="text-xs text-warning font-medium">
                    Almost there!
                  </span>
                )}
              </div>

              {/* Progress visualization */}
              <div className="h-1 bg-warning/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning transition-all duration-500"
                  style={{ width: `${proximityPercentage}%` }}
                />
              </div>
            </div>
          )}

        {isWithinRange && !isCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-success/10 border border-success rounded-lg"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Target className="w-4 h-4 text-success" />
              </motion.div>
              <p className="text-xs text-success font-medium">
                Perfect! You&apos;re close enough to check in and earn the
                reward!
              </p>
            </div>
          </motion.div>
        )}

        {isCheckedIn && (
          <div className="mt-4 p-3 bg-success/10 border border-success rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="text-xs text-success">
                ✨ Reward earned! Check your wallet to see your badge.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Animated Background for Active Locations */}
      {isWithinRange && !isCheckedIn && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary to-primary rounded-xl"
          />
        </div>
      )}

      {/* Pulse effect for available locations */}
      {isWithinRange && !isCheckedIn && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 bg-primary rounded-xl"
          />
        </div>
      )}
    </motion.div>
  );
}
