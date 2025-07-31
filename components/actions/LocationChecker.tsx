"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Clock,
  Info,
  Search,
  Filter,
  Zap,
  Target,
  Shuffle,
  ChevronDown,
  Loader2,
  ExternalLink,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  LocationData,
  ActionType,
  Reward,
  Coordinates,
  RewardType,
} from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useRewards } from "@/hooks/useRewards";
import { isWithinCheckInRadius, getLocationsByType } from "@/data/locations";
import { playActionSound } from "@/lib/sounds";
import LocationCard from "@/components/LocationCard";
import RewardAnimation from "@/components/RewardAnimation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectValue } from "@radix-ui/react-select";
import { SelectItem, SelectTrigger } from "../ui/select";

interface LocationCheckerProps {
  className?: string;
}

type FilterType = "all" | "available" | "checked-in";
// Generate fake locations around user's real location
const generateFakeLocations = (userCoords: Coordinates): LocationData[] => {
  const locationTypes = [
    {
      name: "Coffee Corner",
      description: "A cozy coffee shop with great atmosphere",
      icon: "☕",
      type: RewardType.COMMON,
      rewardName: "Coffee Lover",
      rewardDescription: "You found a great coffee spot!",
    },
    {
      name: "Urban Park",
      description: "A beautiful green space in the city",
      icon: "🌳",
      type: RewardType.COMMON,
      rewardName: "Nature Walker",
      rewardDescription: "You enjoy spending time in nature",
    },
    {
      name: "Art Gallery",
      description: "Local art gallery showcasing local artists",
      icon: "🎨",
      type: RewardType.RARE,
      rewardName: "Art Enthusiast",
      rewardDescription: "You appreciate local art and culture",
    },
    {
      name: "Tech Hub",
      description: "Innovation center for startups",
      icon: "💻",
      type: RewardType.RARE,
      rewardName: "Tech Explorer",
      rewardDescription: "You're interested in technology and innovation",
    },
    {
      name: "Historic Landmark",
      description: "A piece of local history",
      icon: "🏛️",
      type: RewardType.EPIC,
      rewardName: "History Buff",
      rewardDescription: "You value historical significance",
    },
    {
      name: "Gourmet Restaurant",
      description: "Fine dining establishment",
      icon: "🍽️",
      type: RewardType.EPIC,
      rewardName: "Food Connoisseur",
      rewardDescription: "You appreciate exceptional culinary experiences",
    },
    {
      name: "Shopping District",
      description: "Bustling shopping area with unique stores",
      icon: "🛍️",
      type: RewardType.LEGENDARY,
      rewardName: "Urban Explorer",
      rewardDescription: "You love discovering new places and experiences",
    },
    {
      name: "Cultural Center",
      description: "Center for arts and cultural events",
      icon: "🎭",
      type: RewardType.LEGENDARY,
      rewardName: "Culture Seeker",
      rewardDescription: "You actively seek out cultural experiences",
    },
  ];

  const offsets = [
    { lat: 0.001, lng: 0.001, radius: 100 },
    { lat: -0.001, lng: 0.001, radius: 150 },
    { lat: 0.001, lng: -0.001, radius: 80 },
    { lat: -0.001, lng: -0.001, radius: 120 },
    { lat: 0.002, lng: 0.0005, radius: 90 },
    { lat: -0.002, lng: -0.0005, radius: 110 },
    { lat: 0.0005, lng: 0.002, radius: 130 },
    { lat: -0.0005, lng: -0.002, radius: 95 },
  ];

  return offsets.map((offset, index) => ({
    id: `fake-location-${index}`,
    name: locationTypes[index].name,
    description: locationTypes[index].description,
    coordinates: {
      latitude: userCoords.latitude + offset.lat,
      longitude: userCoords.longitude + offset.lng,
    },
    radius: offset.radius,
    reward: {
      name: locationTypes[index].rewardName,
      type: locationTypes[index].type,
      icon: locationTypes[index].icon,
      description: locationTypes[index].rewardDescription,
      actionType: ActionType.LOCATION_CHECKIN,
    },
  }));
};

export default function LocationChecker({
  className = "",
}: LocationCheckerProps) {
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [recentReward, setRecentReward] = useState<Reward | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [checkedInLocations, setCheckedInLocations] = useState<Set<string>>(
    new Set()
  );

  // Location state
  const [fakeLocations, setFakeLocations] = useState<LocationData[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState<string | null>(null);

  const {
    coordinates: realCoordinates,
    accuracy,
    error: geoError,
    isLoading: isGeoLoading,
    permission,
    requestPermission,
    refresh,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000,
    watchPosition: true,
    requestPermission: true,
  });

  const { addReward, checkCooldown, setCooldown, getRewardsByAction } =
    useRewards();

  // Note: useGeolocation hook automatically requests permission when requestPermission: true

  // Create fake locations when user coordinates are available
  useEffect(() => {
    if (realCoordinates) {
      const newFakeLocations = generateFakeLocations(realCoordinates);
      setFakeLocations(newFakeLocations);
    }
  }, [realCoordinates]);

  // Show toast when location access is needed
  useEffect(() => {
    if (permission === "denied") {
      toast.error("Location access denied", {
        description:
          "Please enable location permissions to use check-in feature",
        duration: 5000,
      });
    } else if (geoError) {
      toast.error("Location error", {
        description: geoError,
        duration: 5000,
      });
    } else if (permission === "granted" && realCoordinates) {
      toast.success("Location enabled", {
        description: "You can now check in at nearby locations",
        duration: 3000,
      });
    }
  }, [permission, geoError, realCoordinates]);

  // Get all available locations
  const allLocations = useMemo(() => [...fakeLocations], [fakeLocations]);

  // Get previously checked-in locations
  useEffect(() => {
    const locationRewards = getRewardsByAction(ActionType.LOCATION_CHECKIN);
    const checkedInIds = new Set(
      locationRewards
        .map((reward) => reward.metadata?.locationId)
        .filter(Boolean) as string[]
    );
    setCheckedInLocations(checkedInIds);
  }, [getRewardsByAction]);

  // Handle location check-in with enhanced feedback
  const handleCheckIn = useCallback(
    async (locationId: string) => {
      const location = allLocations.find((l) => l.id === locationId);
      if (!location || !realCoordinates) return;

      setIsCheckingIn(locationId);

      // Check cooldown
      const cooldownCheck = checkCooldown(ActionType.LOCATION_CHECKIN);
      if (cooldownCheck.isActive) {
        alert(`Location check-in is on cooldown. ${cooldownCheck.message}`);
        setIsCheckingIn(null);
        return;
      }

      // Verify user is within check-in radius
      const isWithinRadius = isWithinCheckInRadius(
        realCoordinates,
        location.coordinates,
        location.radius
      );

      if (!isWithinRadius) {
        const distance =
          Math.sqrt(
            Math.pow(
              realCoordinates.latitude - location.coordinates.latitude,
              2
            ) +
              Math.pow(
                realCoordinates.longitude - location.coordinates.longitude,
                2
              )
          ) * 111000; // Rough conversion to meters

        alert(
          `You need to be within ${location.radius}m of ${
            location.name
          } to check in. You're currently ${Math.round(distance)}m away.`
        );
        setIsCheckingIn(null);
        return;
      }

      // Check if already checked in
      if (checkedInLocations.has(locationId)) {
        alert("You have already checked in at this location!");
        setIsCheckingIn(null);
        return;
      }

      try {
        // Add the reward
        const result = addReward({
          name: location.reward.name,
          type: location.reward.type,
          icon: location.reward.icon,
          description: location.reward.description,
          actionType: ActionType.LOCATION_CHECKIN,
          metadata: {
            locationId: location.id,
            locationName: location.name,
            checkedInAt: new Date().toISOString(),
            coordinates: realCoordinates,
          },
        });

        if (result.success && result.reward) {
          // Update checked-in locations
          setCheckedInLocations((prev) => new Set(prev).add(locationId));

          // Set cooldown
          setCooldown(ActionType.LOCATION_CHECKIN);

          // Play check-in success sound
          playActionSound(ActionType.LOCATION_CHECKIN, true).catch(() => {});

          // Show reward animation
          setRecentReward(result.reward);
          setShowRewardAnimation(true);

          // Auto-hide animation after 3 seconds
          setTimeout(() => {
            setShowRewardAnimation(false);
            setRecentReward(null);
          }, 3000);
        } else {
          alert(result.message || "Failed to check in");
        }
      } catch (error) {
        console.error("Check-in error:", error);
        alert("An error occurred during check-in");
      } finally {
        setIsCheckingIn(null);
      }
    },
    [
      realCoordinates,
      checkCooldown,
      addReward,
      setCooldown,
      checkedInLocations,
      allLocations,
    ]
  );

  // Handle getting directions
  const handleGetDirections = useCallback((location: LocationData) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.latitude},${location.coordinates.longitude}`;
    window.open(url, "_blank");
  }, []);

  // Filter and search locations
  const filteredLocations = allLocations.filter((location) => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        location.name.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query) ||
        location.reward.name.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Apply category filter
    switch (filter) {
      case "available":
        if (!realCoordinates) return false;
        return (
          isWithinCheckInRadius(
            realCoordinates,
            location.coordinates,
            location.radius
          ) && !checkedInLocations.has(location.id)
        );

      case "checked-in":
        return checkedInLocations.has(location.id);

      default:
        return true;
    }
  });

  // Sort locations by distance if coordinates available
  const sortedLocations = realCoordinates
    ? [...filteredLocations].sort((a, b) => {
        const distanceA = Math.sqrt(
          Math.pow(a.coordinates.latitude - realCoordinates.latitude, 2) +
            Math.pow(a.coordinates.longitude - realCoordinates.longitude, 2)
        );
        const distanceB = Math.sqrt(
          Math.pow(b.coordinates.latitude - realCoordinates.latitude, 2) +
            Math.pow(b.coordinates.longitude - realCoordinates.longitude, 2)
        );
        return distanceA - distanceB;
      })
    : filteredLocations;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Location Status */}
      <div className="bg-card shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-3xl font-bold">Location Check-in</h2>
            </div>
          </div>
        </div>

        {/* Location Status */}
        <div className="space-y-3">
          {permission === "denied" && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium">Location access denied</p>
                <p className="text-xs">
                  Please enable location permissions to use check-in feature
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={requestPermission}
                  className="px-3 py-1 bg-destructive text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  Enable Location
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cooldown Status */}
        {(() => {
          const cooldownStatus = checkCooldown(ActionType.LOCATION_CHECKIN);
          if (cooldownStatus.isActive) {
            return (
              <div className="mt-4 flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">{cooldownStatus.message}</p>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
     

      {/* Location List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {filter === "all" && "All Locations"}
          {filter === "available" && "Available for Check-in"}
          {filter === "checked-in" && "Already Checked-in"}
          {searchQuery && ` (${sortedLocations.length} results)`}
        </h3>

         {/* Filters and Search */}
      <Card>
        <CardContent className="">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as FilterType)}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="available">
                    Available to Check-in
                  </SelectItem>
                  <SelectItem value="checked-in">Already Checked-in</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={refresh}
                className="p-2"
                title="Refresh location"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isGeoLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

        {sortedLocations.length === 0 ? (

          
          <div className="text-center py-12 rounded-xl shadow-lg border">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <p className="mb-2">No locations found</p>
            <p className="text-sm mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : permission === "denied"
                ? "Location access is required to generate check-in locations"
                : permission === "prompt" || permission === "unknown"
                ? "Please grant location permission to see nearby locations"
                : "Try changing your filter"}
            </p>
            {!realCoordinates && (
              <Button
                onClick={requestPermission}
                className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {permission === "denied"
                  ? "Re-enable Location Access"
                  : "Enable Location Access"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {sortedLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                userCoordinates={realCoordinates}
                isCheckedIn={checkedInLocations.has(location.id)}
                isWithinRange={
                  realCoordinates
                    ? isWithinCheckInRadius(
                        realCoordinates,
                        location.coordinates,
                        location.radius
                      )
                    : false
                }
                onCheckIn={handleCheckIn}
                onGetDirections={handleGetDirections}
                showCheckInButton={permission === "granted"}
                isCheckingIn={isCheckingIn === location.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showRewardAnimation && recentReward && (
          <RewardAnimation
            reward={recentReward}
            onComplete={() => {
              setShowRewardAnimation(false);
              setRecentReward(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
