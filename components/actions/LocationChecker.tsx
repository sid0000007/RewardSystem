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
  Settings,
  Target,
  Shuffle,
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

interface DemoLocationSystemProps {
  className?: string;
}

type FilterType =
  | "all"
  | "nearby"
  | "available"
  | "checked-in"
  | "food"
  | "culture"
  | "nature"
  | "shopping"
  | "landmarks"
  | "tech";

// Generate demo locations around user's location
const generateDemoLocations = (userCoords: Coordinates): LocationData[] => {
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
    id: `demo-location-${index}`,
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

// Helper function to get nearby locations (replaces the imported function)
const getNearbyLocations = (
  userCoords: Coordinates,
  locations: LocationData[],
  maxDistance: number = 5000
): LocationData[] => {
  const calculateDistance = (
    coord1: Coordinates,
    coord2: Coordinates
  ): number => {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = (coord1.latitude * Math.PI) / 180;
    const lat2Rad = (coord2.latitude * Math.PI) / 180;
    const deltaLatRad = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const deltaLonRad = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLonRad / 2) *
        Math.sin(deltaLonRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return locations
    .map((location: LocationData) => ({
      ...location,
      distance: calculateDistance(userCoords, location.coordinates),
    }))
    .filter((location) => location.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

export default function DemoLocationSystem({
  className = "",
}: DemoLocationSystemProps) {
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [recentReward, setRecentReward] = useState<Reward | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [checkedInLocations, setCheckedInLocations] = useState<Set<string>>(
    new Set()
  );

  // Demo-specific state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [simulatedLocation, setSimulatedLocation] =
    useState<Coordinates | null>(null);
  const [demoLocations, setDemoLocations] = useState<LocationData[]>([]);
  const [showDemoControls, setShowDemoControls] = useState(false);

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

  // Use simulated location if in demo mode, otherwise use real coordinates
  const coordinates = isDemoMode ? simulatedLocation : realCoordinates;

  const { addReward, checkCooldown, setCooldown, getRewardsByAction } =
    useRewards();

  // Create demo locations when user coordinates are available
  useEffect(() => {
    if (realCoordinates && demoLocations.length === 0) {
      const newDemoLocations = generateDemoLocations(realCoordinates);
      setDemoLocations(newDemoLocations);
    }
  }, [realCoordinates, demoLocations.length]);

  // Show toast when real location is not active
  useEffect(() => {
    if (permission === "denied" && !isDemoMode) {
      toast.error("Location access denied", {
        description:
          "Enable location permissions or use demo mode to test check-ins",
        duration: 5000,
      });
    } else if (geoError && !isDemoMode) {
      toast.error("Location error", {
        description: geoError,
        duration: 5000,
      });
    } else if (permission === "granted" && realCoordinates && !isDemoMode) {
      toast.success("Location enabled", {
        description: "You can now check in at nearby locations",
        duration: 3000,
      });
    }
  }, [permission, geoError, realCoordinates, isDemoMode]);

  // Get all available locations (demo only)
  const allLocations = useMemo(() => [...demoLocations], [demoLocations]);

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

  // Simulate being at a random nearby location
  const simulateRandomLocation = useCallback(() => {
    if (!realCoordinates) {
      alert("Please enable location access first to use demo mode");
      return;
    }

    const nearbyLocations = allLocations.filter((location) => {
      const distance = Math.sqrt(
        Math.pow(location.coordinates.latitude - realCoordinates.latitude, 2) +
          Math.pow(
            location.coordinates.longitude - realCoordinates.longitude,
            2
          )
      );
      return distance < 0.1; // Within rough vicinity
    });

    if (nearbyLocations.length === 0) {
      // Create a temporary location if none exist
      const randomOffset = {
        lat: (Math.random() - 0.5) * 0.002, // ~200m radius
        lng: (Math.random() - 0.5) * 0.002,
      };

      setSimulatedLocation({
        latitude: realCoordinates.latitude + randomOffset.lat,
        longitude: realCoordinates.longitude + randomOffset.lng,
      });
    } else {
      const randomLocation =
        nearbyLocations[Math.floor(Math.random() * nearbyLocations.length)];
      // Simulate being very close to the location
      const closeOffset = {
        lat: (Math.random() - 0.5) * 0.0001, // ~10m radius
        lng: (Math.random() - 0.5) * 0.0001,
      };

      setSimulatedLocation({
        latitude: randomLocation.coordinates.latitude + closeOffset.lat,
        longitude: randomLocation.coordinates.longitude + closeOffset.lng,
      });
    }

    setIsDemoMode(true);
  }, [realCoordinates, allLocations]);

  // Exit demo mode
  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setSimulatedLocation(null);
  }, []);

  // Handle location check-in with enhanced feedback
  const handleCheckIn = useCallback(
    async (locationId: string) => {
      const location = allLocations.find((l) => l.id === locationId);
      if (!location || !coordinates) return;

      // Check cooldown
      const cooldownCheck = checkCooldown(ActionType.LOCATION_CHECKIN);
      if (cooldownCheck.isActive) {
        alert(`Location check-in is on cooldown. ${cooldownCheck.message}`);
        return;
      }

      // Verify user is within check-in radius
      const isWithinRadius = isWithinCheckInRadius(
        coordinates,
        location.coordinates,
        location.radius
      );

      if (!isWithinRadius) {
        const distance =
          Math.sqrt(
            Math.pow(coordinates.latitude - location.coordinates.latitude, 2) +
              Math.pow(
                coordinates.longitude - location.coordinates.longitude,
                2
              )
          ) * 111000; // Rough conversion to meters

        alert(
          `You need to be within ${location.radius}m of ${
            location.name
          } to check in. You're currently ${Math.round(distance)}m away.`
        );
        return;
      }

      // Check if already checked in
      if (checkedInLocations.has(locationId)) {
        alert("You have already checked in at this location!");
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
            coordinates: coordinates,
          },
        });

        if (result.success && result.reward) {
          // Update checked-in locations
          setCheckedInLocations((prev) => new Set(prev).add(locationId));

          // Set cooldown (reduced for demo)
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
      }
    },
    [
      coordinates,
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
      case "nearby":
        if (!coordinates) return false;
        return getNearbyLocations(coordinates, allLocations, 5000).some(
          (l) => l.id === location.id
        );

      case "available":
        if (!coordinates) return false;
        return (
          isWithinCheckInRadius(
            coordinates,
            location.coordinates,
            location.radius
          ) && !checkedInLocations.has(location.id)
        );

      case "checked-in":
        return checkedInLocations.has(location.id);

      case "food":
      case "culture":
      case "nature":
      case "shopping":
      case "landmarks":
      case "tech":
        return (
          getLocationsByType(filter).some((l) => l.id === location.id) ||
          (location.name.toLowerCase().includes("demo") && filter === "tech")
        );

      default:
        return true;
    }
  });

  // Sort locations by distance if coordinates available
  const sortedLocations = coordinates
    ? [...filteredLocations].sort((a, b) => {
        const distanceA = Math.sqrt(
          Math.pow(a.coordinates.latitude - coordinates.latitude, 2) +
            Math.pow(a.coordinates.longitude - coordinates.longitude, 2)
        );
        const distanceB = Math.sqrt(
          Math.pow(b.coordinates.latitude - coordinates.latitude, 2) +
            Math.pow(b.coordinates.longitude - coordinates.longitude, 2)
        );
        return distanceA - distanceB;
      })
    : filteredLocations;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Demo Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg border p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold">Demo Controls</h3>
          </div>
          <button
            onClick={() => setShowDemoControls(!showDemoControls)}
            className="hover:opacity-80 transition-opacity"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {showDemoControls && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={simulateRandomLocation}
                  disabled={!realCoordinates}
                  className="flex items-center gap-2 px-3 py-2 bg-background/20 hover:bg-background/30 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <Shuffle className="w-4 h-4" />
                  Simulate Near Location
                </button>

                {isDemoMode && (
                  <button
                    onClick={exitDemoMode}
                    className="flex items-center gap-2 px-3 py-2 bg-background/20 hover:bg-background/30 rounded-lg text-sm transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Use Real Location
                  </button>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-80">
                    {isDemoMode
                      ? `🎯 Demo Mode: Simulated at ${simulatedLocation?.latitude.toFixed(
                          4
                        )}, ${simulatedLocation?.longitude.toFixed(4)}`
                      : coordinates
                      ? `📍 Real Location: ${coordinates.latitude.toFixed(
                          4
                        )}, ${coordinates.longitude.toFixed(4)}`
                      : "❌ Location not available"}
                  </p>
                </div>
              </div>

              <div className="text-xs bg-background/10 rounded-lg p-3">
                <p className="mb-1">
                  💡 <strong>Demo Tips:</strong>
                </p>
                <ul className="space-y-1 ml-4">
                  <li>
                    • Click &ldquo;Simulate Near Location&rdquo; to test
                    check-ins without moving
                  </li>
                  <li>
                    • Demo locations are created around your real position
                  </li>
                  <li>• Use real location access for the full experience</li>
                  <li>• Check-in radius is generous for demo purposes</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Location Permission & Status */}
      <div className="rounded-xl shadow-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Location Check-in{" "}
            {isDemoMode && (
              <span className="text-sm text-purple-500">(Demo Mode)</span>
            )}
          </h2>

          <div className="flex items-center gap-2">
            {isGeoLoading && <RefreshCw className="w-5 h-5 animate-spin" />}
            <button
              onClick={refresh}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Refresh location"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Enhanced Location Status */}
        <div className="space-y-3">
          {permission === "denied" && !isDemoMode && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Location access denied</p>
                <p className="text-xs">
                  Enable location permissions or use demo mode to test check-ins
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={requestPermission}
                  className="px-3 py-1 bg-destructive text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  Enable
                </button>
                <button
                  onClick={simulateRandomLocation}
                  className="px-3 py-1 bg-purple-500 text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  Demo Mode
                </button>
              </div>
            </div>
          )}

          {((permission === "granted" && realCoordinates) ||
            (isDemoMode && simulatedLocation)) && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">
                    {isDemoMode ? "Demo location active" : "Location enabled"}
                  </p>
                  <p className="text-xs">
                    {isDemoMode
                      ? "Simulated position for testing"
                      : accuracy
                      ? `Accuracy: ±${Math.round(accuracy)}m`
                      : "Position acquired"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs">
                  {coordinates?.latitude.toFixed(4)},{" "}
                  {coordinates?.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {geoError && !isDemoMode && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Location error</p>
                  <p className="text-xs">{geoError}</p>
                </div>
              </div>
              <button
                onClick={simulateRandomLocation}
                className="px-3 py-1 bg-purple-500 text-xs rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Demo Mode
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Cooldown Status */}
        {(() => {
          const cooldownStatus = checkCooldown(ActionType.LOCATION_CHECKIN);
          if (cooldownStatus.isActive) {
            return (
              <div className="mt-4 flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">{cooldownStatus.message}</p>
                </div>
                {isDemoMode && (
                  <p className="text-xs">Cooldown reduced for demo</p>
                )}
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Search and Filter - keeping your existing implementation */}
      <div className="rounded-xl shadow-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-ring text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="nearby">Nearby</option>
              <option value="available">Available to Check-in</option>
              <option value="checked-in">Already Checked-in</option>
              <option value="food">Food & Drinks</option>
              <option value="culture">Culture & Arts</option>
              <option value="nature">Parks & Nature</option>
              <option value="shopping">Shopping</option>
              <option value="landmarks">Landmarks</option>
              <option value="tech">Tech Hubs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg shadow-md border p-4 text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2" />
          <p className="text-2xl font-bold">{allLocations.length}</p>
          <p className="text-xs">Total Locations</p>
        </div>

        <div className="rounded-lg shadow-md border p-4 text-center">
          <Navigation className="w-6 h-6 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {coordinates
              ? getNearbyLocations(coordinates, allLocations, 5000).length
              : 0}
          </p>
          <p className="text-xs">Nearby (5km)</p>
        </div>

        <div className="rounded-lg shadow-md border p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {coordinates
              ? sortedLocations.filter(
                  (location) =>
                    isWithinCheckInRadius(
                      coordinates,
                      location.coordinates,
                      location.radius
                    ) && !checkedInLocations.has(location.id)
                ).length
              : 0}
          </p>
          <p className="text-xs">Available</p>
        </div>

        <div className="rounded-lg shadow-md border p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2" />
          <p className="text-2xl font-bold">{checkedInLocations.size}</p>
          <p className="text-xs">Checked-in</p>
        </div>
      </div>

      {/* Location List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {filter === "all" && "All Locations"}
          {filter === "nearby" && "Nearby Locations"}
          {filter === "available" && "Available for Check-in"}
          {filter === "checked-in" && "Already Checked-in"}
          {filter === "food" && "Food & Drinks"}
          {filter === "culture" && "Culture & Arts"}
          {filter === "nature" && "Parks & Nature"}
          {filter === "shopping" && "Shopping"}
          {filter === "landmarks" && "Landmarks"}
          {filter === "tech" && "Tech Hubs"}
          {searchQuery && ` (${sortedLocations.length} results)`}
        </h3>

        {sortedLocations.length === 0 ? (
          <div className="text-center py-12 rounded-xl shadow-lg border">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <p className="mb-2">No locations found</p>
            <p className="text-sm mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Try changing your filter"}
            </p>
            {!coordinates && (
              <button
                onClick={simulateRandomLocation}
                className="px-4 py-2 bg-purple-500 rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Demo Mode
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {sortedLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                userCoordinates={coordinates}
                isCheckedIn={checkedInLocations.has(location.id)}
                isWithinRange={
                  coordinates
                    ? isWithinCheckInRadius(
                        coordinates,
                        location.coordinates,
                        location.radius
                      )
                    : false
                }
                onCheckIn={handleCheckIn}
                onGetDirections={handleGetDirections}
                showCheckInButton={permission === "granted" || isDemoMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Help Text */}
      {(permission === "granted" || isDemoMode) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">How location check-in works:</p>
              <ul className="space-y-1 text-xs">
                <li>• Move within the check-in radius of any location</li>
                <li>
                  • Tap &ldquo;Check In&rdquo; when you&rsquo;re close enough
                </li>
                <li>• Earn unique rewards for each location</li>
                <li>• Each location can only be checked-in once</li>
                <li>• There&rsquo;s a cooldown between check-ins</li>
                {isDemoMode && (
                  <li className="text-purple-600 dark:text-purple-400">
                    • <strong>Demo Mode:</strong> Simulated location for easy
                    testing!
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

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
