import { LocationData, RewardType, ActionType, Coordinates } from '@/types';

// Sample locations around major cities for demo purposes
export const availableLocations: LocationData[] = [
  // Coffee Shops & Cafes
  {
    id: 'central-coffee-1',
    name: 'Central Coffee House',
    description: 'A cozy coffee shop in the heart of downtown',
    coordinates: {
      latitude: 40.7589,
      longitude: -73.9851
    },
    radius: 50, // 50 meters
    reward: {
      name: 'Coffee Connoisseur',
      type: RewardType.COMMON,
      icon: '☕',
      description: 'You appreciate good coffee and cozy atmospheres',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'artisan-brew-2',
    name: 'Artisan Brew Co.',
    description: 'Specialty coffee roasted on-site daily',
    coordinates: {
      latitude: 40.7505,
      longitude: -73.9934
    },
    radius: 75,
    reward: {
      name: 'Brew Master',
      type: RewardType.RARE,
      icon: '🫘',
      description: 'You seek out the finest artisanal coffee',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Parks & Nature
  {
    id: 'riverside-park-1',
    name: 'Riverside Park',
    description: 'Beautiful park along the river with walking trails',
    coordinates: {
      latitude: 40.7812,
      longitude: -73.9665
    },
    radius: 100,
    reward: {
      name: 'Nature Walker',
      type: RewardType.COMMON,
      icon: '🌳',
      description: 'You love spending time in nature',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'botanical-gardens-1',
    name: 'City Botanical Gardens',
    description: 'Stunning collection of plants from around the world',
    coordinates: {
      latitude: 40.7748,
      longitude: -73.9635
    },
    radius: 150,
    reward: {
      name: 'Garden Explorer',
      type: RewardType.RARE,
      icon: '🌺',
      description: 'You appreciate the beauty of botanical diversity',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Museums & Culture
  {
    id: 'art-museum-1',
    name: 'Metropolitan Museum of Art',
    description: 'World-renowned art museum with extensive collections',
    coordinates: {
      latitude: 40.7794,
      longitude: -73.9632
    },
    radius: 200,
    reward: {
      name: 'Art Enthusiast',
      type: RewardType.EPIC,
      icon: '🎨',
      description: 'You have a deep appreciation for fine art',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'science-museum-1',
    name: 'Museum of Natural History',
    description: 'Explore the wonders of natural science and history',
    coordinates: {
      latitude: 40.7813,
      longitude: -73.9740
    },
    radius: 180,
    reward: {
      name: 'Science Explorer',
      type: RewardType.EPIC,
      icon: '🦕',
      description: 'You are curious about the natural world',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Restaurants & Food
  {
    id: 'pizza-corner-1',
    name: 'Tony\'s Pizza Corner',
    description: 'Authentic New York style pizza since 1962',
    coordinates: {
      latitude: 40.7505,
      longitude: -73.9857
    },
    radius: 25,
    reward: {
      name: 'Pizza Lover',
      type: RewardType.COMMON,
      icon: '🍕',
      description: 'You know where to find the best pizza in town',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'fine-dining-1',
    name: 'Le Bernardin',
    description: 'Michelin-starred fine dining restaurant',
    coordinates: {
      latitude: 40.7614,
      longitude: -73.9776
    },
    radius: 30,
    reward: {
      name: 'Fine Diner',
      type: RewardType.LEGENDARY,
      icon: '🍽️',
      description: 'You appreciate exceptional culinary experiences',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Landmarks & Tourist Spots
  {
    id: 'times-square-1',
    name: 'Times Square',
    description: 'The crossroads of the world',
    coordinates: {
      latitude: 40.7580,
      longitude: -73.9855
    },
    radius: 200,
    reward: {
      name: 'Tourist Magnet',
      type: RewardType.SPECIAL,
      icon: '🏙️',
      description: 'You\'ve visited one of the world\'s most famous places',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'brooklyn-bridge-1',
    name: 'Brooklyn Bridge',
    description: 'Historic suspension bridge connecting Manhattan and Brooklyn',
    coordinates: {
      latitude: 40.7061,
      longitude: -73.9969
    },
    radius: 150,
    reward: {
      name: 'Bridge Walker',
      type: RewardType.RARE,
      icon: '🌉',
      description: 'You\'ve crossed one of NYC\'s most iconic bridges',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Shopping & Entertainment
  {
    id: 'shopping-center-1',
    name: 'Fifth Avenue Shopping District',
    description: 'Premium shopping destination with luxury brands',
    coordinates: {
      latitude: 40.7549,
      longitude: -73.9840
    },
    radius: 300,
    reward: {
      name: 'Fashion Scout',
      type: RewardType.RARE,
      icon: '🛍️',
      description: 'You have an eye for style and luxury',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'theater-district-1',
    name: 'Broadway Theater District',
    description: 'The heart of American theater',
    coordinates: {
      latitude: 40.7590,
      longitude: -73.9845
    },
    radius: 250,
    reward: {
      name: 'Theater Buff',
      type: RewardType.EPIC,
      icon: '🎭',
      description: 'You love the magic of live theater',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Tech & Innovation Hubs
  {
    id: 'tech-hub-1',
    name: 'Silicon Alley Tech Hub',
    description: 'Innovation center for startups and tech companies',
    coordinates: {
      latitude: 40.7282,
      longitude: -74.0776
    },
    radius: 100,
    reward: {
      name: 'Tech Innovator',
      type: RewardType.LEGENDARY,
      icon: '💻',
      description: 'You\'re at the forefront of technological innovation',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Universities & Libraries
  {
    id: 'public-library-1',
    name: 'New York Public Library',
    description: 'Iconic library with vast collections and beautiful architecture',
    coordinates: {
      latitude: 40.7532,
      longitude: -73.9822
    },
    radius: 120,
    reward: {
      name: 'Knowledge Seeker',
      type: RewardType.RARE,
      icon: '📚',
      description: 'You value knowledge and learning',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },

  // Demo/Test Locations (for easy testing)
  {
    id: 'demo-location-1',
    name: 'Demo Coffee Shop',
    description: 'A test location for app demonstration',
    coordinates: {
      latitude: 37.7749, // San Francisco coordinates for easy testing
      longitude: -122.4194
    },
    radius: 1000, // Large radius for easy testing
    reward: {
      name: 'Demo Explorer',
      type: RewardType.COMMON,
      icon: '🧪',
      description: 'You found the demo location!',
      actionType: ActionType.LOCATION_CHECKIN
    }
  },
  {
    id: 'demo-location-2',
    name: 'Test Landmark',
    description: 'Another test location with generous check-in radius',
    coordinates: {
      latitude: 34.0522, // Los Angeles coordinates
      longitude: -118.2437
    },
    radius: 1000,
    reward: {
      name: 'Test Pioneer',
      type: RewardType.RARE,
      icon: '🗺️',
      description: 'You\'re helping test the location system',
      actionType: ActionType.LOCATION_CHECKIN
    }
  }
];

// Helper functions
export const getLocationById = (id: string): LocationData | undefined => {
  return availableLocations.find(location => location.id === id);
};

export const getLocationsByType = (category: 'food' | 'culture' | 'nature' | 'shopping' | 'landmarks' | 'tech' | 'demo'): LocationData[] => {
  const categoryKeywords = {
    food: ['coffee', 'pizza', 'restaurant', 'dining', 'brew'],
    culture: ['museum', 'theater', 'art', 'library'],
    nature: ['park', 'garden', 'botanical', 'river'],
    shopping: ['shopping', 'avenue', 'fashion'],
    landmarks: ['bridge', 'square', 'times'],
    tech: ['tech', 'silicon', 'innovation'],
    demo: ['demo', 'test']
  };

  const keywords = categoryKeywords[category] || [];
  return availableLocations.filter(location =>
    keywords.some(keyword =>
      location.name.toLowerCase().includes(keyword) ||
      location.description.toLowerCase().includes(keyword)
    )
  );
};

export const getLocationsByRarity = (rarity: RewardType): LocationData[] => {
  return availableLocations.filter(location => location.reward.type === rarity);
};

export const getLocationsByRadius = (minRadius: number, maxRadius: number): LocationData[] => {
  return availableLocations.filter(location =>
    location.radius >= minRadius && location.radius <= maxRadius
  );
};

export const getNearbyLocations = (
  userCoords: Coordinates,
  maxDistance: number = 5000 // 5km default
): LocationData[] => {
  const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
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

  return availableLocations
    .map(location => ({
      ...location,
      distance: calculateDistance(userCoords, location.coordinates)
    }))
    .filter(location => location.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

export const getLocationStats = () => {
  const stats = {
    total: availableLocations.length,
    byRarity: {
      [RewardType.COMMON]: getLocationsByRarity(RewardType.COMMON).length,
      [RewardType.RARE]: getLocationsByRarity(RewardType.RARE).length,
      [RewardType.EPIC]: getLocationsByRarity(RewardType.EPIC).length,
      [RewardType.LEGENDARY]: getLocationsByRarity(RewardType.LEGENDARY).length,
      [RewardType.SPECIAL]: getLocationsByRarity(RewardType.SPECIAL).length
    },
    byCategory: {
      food: getLocationsByType('food').length,
      culture: getLocationsByType('culture').length,
      nature: getLocationsByType('nature').length,
      shopping: getLocationsByType('shopping').length,
      landmarks: getLocationsByType('landmarks').length,
      tech: getLocationsByType('tech').length,
      demo: getLocationsByType('demo').length
    },
    averageRadius: Math.round(
      availableLocations.reduce((sum, location) => sum + location.radius, 0) / availableLocations.length
    )
  };

  return stats;
};

export const isWithinCheckInRadius = (
  userCoords: Coordinates,
  locationCoords: Coordinates,
  radius: number
): boolean => {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = (userCoords.latitude * Math.PI) / 180;
  const lat2Rad = (locationCoords.latitude * Math.PI) / 180;
  const deltaLatRad = ((locationCoords.latitude - userCoords.latitude) * Math.PI) / 180;
  const deltaLonRad = ((locationCoords.longitude - userCoords.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radius;
};

export const getDistanceToLocation = (
  userCoords: Coordinates,
  locationCoords: Coordinates
): number => {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = (userCoords.latitude * Math.PI) / 180;
  const lat2Rad = (locationCoords.latitude * Math.PI) / 180;
  const deltaLatRad = ((locationCoords.latitude - userCoords.latitude) * Math.PI) / 180;
  const deltaLonRad = ((locationCoords.longitude - userCoords.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};