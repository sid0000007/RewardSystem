import { VideoData, RewardType, ActionType } from '@/types';

// Using local videos for better control and reliability
export const videoLibrary: VideoData[] = [
  // Nature & Environment Videos
  {
    id: 'nature-forest-1',
    title: 'Peaceful Forest Sounds',
    description: 'Relax with the soothing sounds of a peaceful forest',
    url: '/videos/nature-forest.mp4',
    thumbnail: '/images/thumbnails/nature-forest.png',
    duration: 29,
    minWatchTime: 15,
    reward: {
      name: 'Nature Explorer',
      type: RewardType.COMMON,
      icon: '🌲',
      description: 'You appreciate the beauty of nature',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Educational Content
  {
    id: 'science-demo-1',
    title: 'Amazing Science Experiments',
    description: 'Learn through fun and engaging science demonstrations',
    url: '/videos/science-demo.mp4',
    thumbnail: '/images/thumbnails/science-demo.png',
    duration: 45,
    minWatchTime: 15,
    reward: {
      name: 'Science Enthusiast',
      type: RewardType.RARE,
      icon: '🔬',
      description: 'Knowledge seeker and science lover',
      actionType: ActionType.VIDEO_WATCH
    }
  },


  // Art & Culture
  {
    id: 'art-gallery-1',
    title: 'Virtual Art Gallery Tour',
    description: 'Explore famous artworks from around the world',
    url: '/videos/art-gallery.mp4',
    thumbnail: '/images/thumbnails/art-gallery.png',
    duration: 18,
    minWatchTime: 15,
    reward: {
      name: 'Art Connoisseur',
      type: RewardType.EPIC,
      icon: '🎨',
      description: 'You have an eye for fine art',
      actionType: ActionType.VIDEO_WATCH
    }
  },

  // Technology & Innovation
  {
    id: 'tech-future-1',
    title: 'Future of Technology',
    description: 'Explore cutting-edge technology and innovations',
    url: '/videos/tech-future.mp4',
    thumbnail: '/images/thumbnails/tech-future.png',
    duration: 45,
    minWatchTime: 15,
    reward: {
      name: 'Tech Pioneer',
      type: RewardType.LEGENDARY,
      icon: '🚀',
      description: 'You embrace the future of technology',
      actionType: ActionType.VIDEO_WATCH
    }
  },


  // Short Form Content
  {
    id: 'quick-tips-1',
    title: 'Daily Life Hacks',
    description: 'Quick tips to make your daily life easier',
    url: '/videos/quick-tips.mp4',
    thumbnail: '/images/thumbnails/quick-tips.png',
    duration: 59,
    minWatchTime: 15,
    reward: {
      name: 'Life Hacker',
      type: RewardType.COMMON,
      icon: '💡',
      description: 'You love practical solutions',
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