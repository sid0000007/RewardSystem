import { VideoData, RewardType, ActionType } from '@/types';

// Using placeholder videos from various sources for demo purposes
export const videoLibrary: VideoData[] = [
  // Nature & Environment Videos
  {
    id: 'nature-forest-1',
    title: 'Peaceful Forest Sounds',
    description: 'Relax with the soothing sounds of a peaceful forest',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForestCamping.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
    duration: 30,
    minWatchTime: 15,
    reward: {
      name: 'Nature Explorer',
      type: RewardType.COMMON,
      icon: '🌲',
      description: 'You appreciate the beauty of nature',
      actionType: ActionType.VIDEO_WATCH
    }
  },
  {
    id: 'ocean-waves-1',
    title: 'Ocean Waves at Sunset',
    description: 'Watch beautiful ocean waves during golden hour',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop',
    duration: 45,
    minWatchTime: 15,
    reward: {
      name: 'Wave Watcher',
      type: RewardType.COMMON,
      icon: '🌊',
      description: 'You find peace in ocean sounds',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Educational Content
  {
    id: 'science-demo-1',
    title: 'Amazing Science Experiments',
    description: 'Learn through fun and engaging science demonstrations',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop',
    duration: 60,
    minWatchTime: 15,
    reward: {
      name: 'Science Enthusiast',
      type: RewardType.RARE,
      icon: '🔬',
      description: 'Knowledge seeker and science lover',
      actionType: ActionType.VIDEO_WATCH
    }
  },
  {
    id: 'history-facts-1',
    title: 'Fascinating Historical Facts',
    description: 'Discover interesting facts from throughout history',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&h=200&fit=crop',
    duration: 40,
    minWatchTime: 15,
    reward: {
      name: 'History Buff',
      type: RewardType.RARE,
      icon: '📚',
      description: 'You love learning about the past',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Art & Culture
  {
    id: 'art-gallery-1',
    title: 'Virtual Art Gallery Tour',
    description: 'Explore famous artworks from around the world',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
    duration: 90,
    minWatchTime: 15,
    reward: {
      name: 'Art Connoisseur',
      type: RewardType.EPIC,
      icon: '🎨',
      description: 'You have an eye for fine art',
      actionType: ActionType.VIDEO_WATCH
    }
  },
  {
    id: 'music-performance-1',
    title: 'Classical Music Performance',
    description: 'Enjoy a beautiful classical music performance',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    duration: 120,
    minWatchTime: 15,
    reward: {
      name: 'Music Lover',
      type: RewardType.EPIC,
      icon: '🎵',
      description: 'You appreciate beautiful music',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Technology & Innovation
  {
    id: 'tech-future-1',
    title: 'Future of Technology',
    description: 'Explore cutting-edge technology and innovations',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    duration: 75,
    minWatchTime: 15,
    reward: {
      name: 'Tech Pioneer',
      type: RewardType.LEGENDARY,
      icon: '🚀',
      description: 'You embrace the future of technology',
      actionType: ActionType.VIDEO_WATCH
    }
  },
  {
    id: 'space-exploration-1',
    title: 'Journey to the Stars',
    description: 'Embark on an incredible space exploration adventure',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop',
    duration: 150,
    minWatchTime: 15,
    reward: {
      name: 'Space Explorer',
      type: RewardType.LEGENDARY,
      icon: '🌌',
      description: 'You dream of exploring the cosmos',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Short Form Content
  {
    id: 'quick-tips-1',
    title: 'Daily Life Hacks',
    description: 'Quick tips to make your daily life easier',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=200&fit=crop',
    duration: 20,
    minWatchTime: 15,
    reward: {
      name: 'Life Hacker',
      type: RewardType.COMMON,
      icon: '💡',
      description: 'You love practical solutions',
      actionType: ActionType.VIDEO_WATCH
    }
  },
  {
    id: 'cooking-demo-1',
    title: 'Quick Recipe Demo',
    description: 'Learn to make a delicious dish in minutes',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    duration: 35,
    minWatchTime: 15,
    reward: {
      name: 'Chef Apprentice',
      type: RewardType.RARE,
      icon: '👨‍🍳',
      description: 'You enjoy cooking and trying new recipes',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Special & Seasonal Content
  {
    id: 'holiday-special-1',
    title: 'Holiday Traditions Around the World',
    description: 'Discover how different cultures celebrate holidays',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300&h=200&fit=crop',
    duration: 80,
    minWatchTime: 15,
    reward: {
      name: 'Cultural Explorer',
      type: RewardType.SPECIAL,
      icon: '🎊',
      description: 'You celebrate diversity and culture',
      actionType: ActionType.VIDEO_WATCH
    }
  },
  {
    id: 'anniversary-special',
    title: 'App Anniversary Celebration',
    description: 'Join us in celebrating another year of collecting!',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop',
    duration: 60,
    minWatchTime: 15,
    reward: {
      name: 'Anniversary Badge',
      type: RewardType.SPECIAL,
      icon: '🎂',
      description: 'Thanks for being part of our journey',
      actionType: ActionType.VIDEO_WATCH
    }
  }
];

// Helper functions
export const getVideoById = (id: string): VideoData | undefined => {
  return videoLibrary.find(video => video.id === id);
};

export const getVideosByCategory = (category: 'nature' | 'education' | 'art' | 'tech' | 'quick' | 'special'): VideoData[] => {
  const categoryPrefixes = {
    nature: ['nature-', 'ocean-'],
    education: ['science-', 'history-'],
    art: ['art-', 'music-'],
    tech: ['tech-', 'space-'],
    quick: ['quick-', 'cooking-'],
    special: ['holiday-', 'anniversary-']
  };

  const prefixes = categoryPrefixes[category] || [];
  return videoLibrary.filter(video => 
    prefixes.some(prefix => video.id.startsWith(prefix))
  );
};

export const getVideosByRarity = (rarity: RewardType): VideoData[] => {
  return videoLibrary.filter(video => video.reward.type === rarity);
};

export const getVideosByDuration = (minDuration: number, maxDuration: number): VideoData[] => {
  return videoLibrary.filter(video => 
    video.duration >= minDuration && video.duration <= maxDuration
  );
};

export const getRandomVideo = (): VideoData => {
  const randomIndex = Math.floor(Math.random() * videoLibrary.length);
  return videoLibrary[randomIndex];
};

export const getRecommendedVideos = (watchedVideoIds: string[], count: number = 3): VideoData[] => {
  const unwatchedVideos = videoLibrary.filter(video => 
    !watchedVideoIds.includes(video.id)
  );
  
  // Shuffle and take the requested count
  const shuffled = [...unwatchedVideos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getTotalVideoCount = (): number => {
  return videoLibrary.length;
};

export const getTotalWatchTime = (): number => {
  return videoLibrary.reduce((total, video) => total + video.duration, 0);
};

export const getVideoStats = () => {
  const stats = {
    total: videoLibrary.length,
    totalDuration: getTotalWatchTime(),
    byRarity: {
      [RewardType.COMMON]: getVideosByRarity(RewardType.COMMON).length,
      [RewardType.RARE]: getVideosByRarity(RewardType.RARE).length,
      [RewardType.EPIC]: getVideosByRarity(RewardType.EPIC).length,
      [RewardType.LEGENDARY]: getVideosByRarity(RewardType.LEGENDARY).length,
      [RewardType.SPECIAL]: getVideosByRarity(RewardType.SPECIAL).length
    },
    averageDuration: Math.round(getTotalWatchTime() / videoLibrary.length)
  };
  
  return stats;
};