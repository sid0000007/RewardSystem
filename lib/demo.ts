// lib/demo-utils.ts
import { Coordinates, LocationData, RewardType, ActionType } from '@/types';

// Enhanced distance formatting with more granular levels
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 10) {
    return `${Math.round(distanceInMeters)}m`;
  } else if (distanceInMeters < 100) {
    return `${Math.round(distanceInMeters / 10) * 10}m`;
  } else if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters / 50) * 50}m`;
  } else if (distanceInMeters < 10000) {
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  } else {
    return `${Math.round(distanceInMeters / 1000)}km`;
  }
};

// Enhanced reward rarity system
export const getRewardRarity = (type: RewardType) => {
  const rarityMap = {
    [RewardType.COMMON]: {
      label: 'Common',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
      probability: 0.6
    },
    [RewardType.RARE]: {
      label: 'Rare',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      probability: 0.25
    },
    [RewardType.EPIC]: {
      label: 'Epic',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      probability: 0.12
    },
    [RewardType.LEGENDARY]: {
      label: 'Legendary',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      probability: 0.02
    },
    [RewardType.SPECIAL]: {
      label: 'Special',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      borderColor: 'border-pink-200 dark:border-pink-800',
      probability: 0.01
    }
  };

  return rarityMap[type] || rarityMap[RewardType.COMMON];
};

// Generate demo locations around a user's position
export const generateDemoLocationsAroundUser = (
  userCoords: Coordinates,
  count: number = 6
): LocationData[] => {
  const demoTemplates = [
    {
      name: 'Demo Coffee House',
      description: 'A virtual coffee shop perfect for testing check-ins',
      icon: '☕',
      rewardName: 'Coffee Explorer',
      rewardType: RewardType.COMMON,
      rewardDescription: 'You discovered a great coffee spot in demo mode!',
      radius: 100
    },
    {
      name: 'Test Park',
      description: 'A simulated park location with generous check-in radius',
      icon: '🌳',
      rewardName: 'Nature Seeker',
      rewardType: RewardType.RARE,
      rewardDescription: 'You explored nature in our demo environment!',
      radius: 150
    },
    {
      name: 'Demo Art Gallery',
      description: 'Experience art appreciation through our location system',
      icon: '🎨',
      rewardName: 'Art Enthusiast',
      rewardType: RewardType.EPIC,
      rewardDescription: 'Your appreciation for art shines through!',
      radius: 80
    },
    {
      name: 'Virtual Tech Hub',
      description: 'Innovation center for demo and testing purposes',
      icon: '💻',
      rewardName: 'Tech Pioneer',
      rewardType: RewardType.LEGENDARY,
      rewardDescription: 'You are at the forefront of location-based rewards!',
      radius: 120
    },
    {
      name: 'Demo Restaurant',
      description: 'Fine dining experience in simulation',
      icon: '🍽️',
      rewardName: 'Culinary Explorer',
      rewardType: RewardType.RARE,
      rewardDescription: 'Your taste for good food is evident!',
      radius: 75
    },
    {
      name: 'Test Landmark',
      description: 'A significant demo location with special rewards',
      icon: '🏛️',
      rewardName: 'Demo Master',
      rewardType: RewardType.SPECIAL,
      rewardDescription: 'You have mastered the demo experience!',
      radius: 200
    }
  ];

  // Generate positions around the user in a rough circle
  const locations: LocationData[] = [];
  const angleStep = (2 * Math.PI) / count;
  const baseRadius = 0.002; // roughly 200m

  for (let i = 0; i < count; i++) {
    const template = demoTemplates[i % demoTemplates.length];
    const angle = i * angleStep;
    const radiusVariation = 0.5 + Math.random() * 0.5; // 0.5x to 1x variation
    const distance = baseRadius * radiusVariation;

    const lat = userCoords.latitude + Math.cos(angle) * distance;
    const lng = userCoords.longitude + Math.sin(angle) * distance;

    locations.push({
      id: `demo-generated-${i}`,
      name: `${template.name} ${i + 1}`,
      description: template.description,
      coordinates: {
        latitude: lat,
        longitude: lng
      },
      radius: template.radius,
      reward: {
        name: template.rewardName,
        type: template.rewardType,
        icon: template.icon,
        description: template.rewardDescription,
        actionType: ActionType.LOCATION_CHECKIN
      }
    });
  }

  return locations;
};

// Simulate user movement towards a location
export const simulateMovementToLocation = (
  currentCoords: Coordinates,
  targetCoords: Coordinates,
  stepPercentage: number = 0.1
): Coordinates => {
  const latDiff = targetCoords.latitude - currentCoords.latitude;
  const lngDiff = targetCoords.longitude - currentCoords.longitude;

  return {
    latitude: currentCoords.latitude + (latDiff * stepPercentage),
    longitude: currentCoords.longitude + (lngDiff * stepPercentage)
  };
};

// Calculate bearing between two coordinates
export const calculateBearing = (
  from: Coordinates,
  to: Coordinates
): number => {
  const dLng = (to.longitude - from.longitude) * Math.PI / 180;
  const lat1 = from.latitude * Math.PI / 180;
  const lat2 = to.latitude * Math.PI / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

// Get compass direction from bearing
export const getCompassDirection = (bearing: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

// Enhanced proximity calculation with steps
export const getProximityStatus = (
  userCoords: Coordinates,
  locationCoords: Coordinates,
  checkInRadius: number
): {
  distance: number;
  isWithinRadius: boolean;
  proximityPercentage: number;
  status: 'far' | 'distant' | 'nearby' | 'close' | 'within';
  message: string;
} => {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = (userCoords.latitude * Math.PI) / 180;
  const lat2Rad = (locationCoords.latitude * Math.PI) / 180;
  const deltaLatRad = ((locationCoords.latitude - userCoords.latitude) * Math.PI) / 180;
  const deltaLonRad = ((locationCoords.longitude - userCoords.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const isWithinRadius = distance <= checkInRadius;
  const proximityPercentage = Math.max(0, Math.min(100, ((checkInRadius - distance) / checkInRadius) * 100));

  let status: 'far' | 'distant' | 'nearby' | 'close' | 'within';
  let message: string;

  if (isWithinRadius) {
    status = 'within';
    message = 'Perfect! You can check in now!';
  } else if (distance <= checkInRadius * 1.5) {
    status = 'close';
    message = `Almost there! Move ${formatDistance(distance - checkInRadius)} closer`;
  } else if (distance <= checkInRadius * 3) {
    status = 'nearby';
    message = `Getting close! ${formatDistance(distance)} away`;
  } else if (distance <= checkInRadius * 10) {
    status = 'distant';
    message = `${formatDistance(distance)} away`;
  } else {
    status = 'far';
    message = `${formatDistance(distance)} away - quite far`;
  }

  return {
    distance,
    isWithinRadius,
    proximityPercentage,
    status,
    message
  };
};

// Demo-specific location data
export const createDemoLocationData = (
  userCoords: Coordinates
): LocationData[] => {
  return [
    // Close demo location
    {
      id: 'demo-close-1',
      name: 'Nearby Demo Café',
      description: 'A demo location very close to your position for easy testing',
      coordinates: {
        latitude: userCoords.latitude + 0.0008, // ~80-90m
        longitude: userCoords.longitude + 0.0008
      },
      radius: 100,
      reward: {
        name: 'Quick Tester',
        type: RewardType.COMMON,
        icon: '🚀',
        description: 'You quickly found and tested a nearby location!',
        actionType: ActionType.LOCATION_CHECKIN
      }
    },
    // Medium distance demo location
    {
      id: 'demo-medium-1',
      name: 'Demo Art Studio',
      description: 'A moderate distance demo location to test walking simulation',
      coordinates: {
        latitude: userCoords.latitude + 0.0015, // ~150-170m
        longitude: userCoords.longitude - 0.0010
      },
      radius: 120,
      reward: {
        name: 'Art Seeker',
        type: RewardType.RARE,
        icon: '🎨',
        description: 'You made the journey to discover art!',
        actionType: ActionType.LOCATION_CHECKIN
      }
    },
    // Far demo location
    {
      id: 'demo-far-1',
      name: 'Demo Adventure Point',
      description: 'A distant demo location to test the full experience',
      coordinates: {
        latitude: userCoords.latitude + 0.003, // ~300-350m
        longitude: userCoords.longitude + 0.002
      },
      radius: 150,
      reward: {
        name: 'Distance Explorer',
        type: RewardType.EPIC,
        icon: '🗺️',
        description: 'You went the extra distance for this reward!',
        actionType: ActionType.LOCATION_CHECKIN
      }
    }
  ];
};

// Sound effects for demo (mock implementation)
export const playActionSound = async (
  actionType: ActionType,
  success: boolean = true
): Promise<void> => {
  // Mock implementation - in real app would play actual sounds
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(
      success ? 'Check-in successful!' : 'Check-in failed'
    );
    utterance.volume = 0.1;
    utterance.rate = 1.5;
    utterance.pitch = success ? 1.2 : 0.8;

    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.log('Sound feedback not available');
    }
  }

  // Alternative: Use Web Audio API for better sound effects
  return Promise.resolve();
};

// Validate coordinates
export const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords &&
    typeof coords.latitude === 'number' &&
    typeof coords.longitude === 'number' &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
};

export default {
  formatDistance,
  getRewardRarity,
  generateDemoLocationsAroundUser,
  simulateMovementToLocation,
  calculateBearing,
  getCompassDirection,
  getProximityStatus,
  createDemoLocationData,
  playActionSound,
  isValidCoordinates
};