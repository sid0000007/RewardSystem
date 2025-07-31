import { CodeData, RewardType, ActionType } from '@/types';

export const validCodes: CodeData[] = [
  // Common rewards
  {
    code: 'WELCOME2024',
    reward: {
      name: 'Welcome Coin',
      type: RewardType.COMMON,
      icon: '🪙',
      description: 'A commemorative coin for new collectors',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Registration Booth',
    event: 'New User Welcome',
    maxUses: 1
  },
  {
    code: 'COFFEE123',
    reward: {
      name: 'Coffee Bean',
      type: RewardType.COMMON,
      icon: '☕',
      description: 'A premium coffee bean collectible',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Local Coffee Shop',
    event: 'Morning Special'
  },
  {
    code: 'BOOK42',
    reward: {
      name: 'Wisdom Badge',
      type: RewardType.COMMON,
      icon: '📚',
      description: 'Knowledge is power badge',
      actionType: ActionType.CODE_SCAN
    },
    location: 'City Library',
    event: 'Reading Challenge'
  },
  {
    code: 'PIZZA789',
    reward: {
      name: 'Pizza Slice',
      type: RewardType.COMMON,
      icon: '🍕',
      description: 'Delicious virtual pizza slice',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Tony\'s Pizzeria',
    event: 'Lunch Special'
  },

  // Rare rewards
  {
    code: 'CONCERT2024',
    reward: {
      name: 'VIP Ticket',
      type: RewardType.RARE,
      icon: '🎫',
      description: 'Exclusive concert VIP access badge',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Music Venue',
    event: 'Summer Concert Series',
    maxUses: 100
  },
  {
    code: 'MUSEUM567',
    reward: {
      name: 'Ancient Artifact',
      type: RewardType.RARE,
      icon: '🏺',
      description: 'Replica of a historical artifact',
      actionType: ActionType.CODE_SCAN
    },
    location: 'City Museum',
    event: 'Archaeological Exhibition'
  },
  {
    code: 'TECH2024',
    reward: {
      name: 'Circuit Board',
      type: RewardType.RARE,
      icon: '💾',
      description: 'Vintage computer circuit board',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Tech Conference',
    event: 'Innovation Summit'
  },
  {
    code: 'GARDEN456',
    reward: {
      name: 'Golden Flower',
      type: RewardType.RARE,
      icon: '🌻',
      description: 'A rare golden sunflower',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Botanical Garden',
    event: 'Spring Festival'
  },

  // Epic rewards
  {
    code: 'DRAGON2024',
    reward: {
      name: 'Dragon Scale',
      type: RewardType.EPIC,
      icon: '🐲',
      description: 'A mystical dragon scale with ancient power',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Fantasy Convention',
    event: 'Dragon Quest Event',
    maxUses: 50
  },
  {
    code: 'SPACE999',
    reward: {
      name: 'Meteorite Fragment',
      type: RewardType.EPIC,
      icon: '☄️',
      description: 'A piece of a real meteorite from space',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Planetarium',
    event: 'Cosmic Discovery Night'
  },
  {
    code: 'TREASURE777',
    reward: {
      name: 'Pirate Compass',
      type: RewardType.EPIC,
      icon: '🧭',
      description: 'An enchanted compass that points to treasure',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Maritime Museum',
    event: 'Pirate Exhibition'
  },

  // Legendary rewards
  {
    code: 'LEGEND001',
    reward: {
      name: 'Crown Jewel',
      type: RewardType.LEGENDARY,
      icon: '💎',
      description: 'The most precious gem in the collection',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Royal Palace Tour',
    event: 'Crown Jewels Exhibition',
    maxUses: 10,
    expiresAt: new Date('2024-12-31')
  },
  {
    code: 'PHOENIX2024',
    reward: {
      name: 'Phoenix Feather',
      type: RewardType.LEGENDARY,
      icon: '🔥',
      description: 'A feather from the legendary phoenix',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Mythical Creatures Expo',
    event: 'Legend Quest',
    maxUses: 25
  },

  // Special event rewards
  {
    code: 'HOLIDAY2024',
    reward: {
      name: 'Festive Star',
      type: RewardType.SPECIAL,
      icon: '⭐',
      description: 'A special holiday commemorative star',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Holiday Market',
    event: 'Winter Festival',
    maxUses: 200,
    expiresAt: new Date('2024-12-25')
  },
  {
    code: 'BIRTHDAY2024',
    reward: {
      name: 'Birthday Cake',
      type: RewardType.SPECIAL,
      icon: '🎂',
      description: 'Celebrate another year of collecting!',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Celebration Hall',
    event: 'App Anniversary'
  },

  // Demo/Test codes
  {
    code: 'TEST123',
    reward: {
      name: 'Test Badge',
      type: RewardType.COMMON,
      icon: '🧪',
      description: 'A badge for testing the scanning system',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Development Lab',
    event: 'System Testing'
  },
  {
    code: 'DEMO456',
    reward: {
      name: 'Demo Trophy',
      type: RewardType.RARE,
      icon: '🏆',
      description: 'You found the demo code!',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Demo Area',
    event: 'Product Demo'
  },
  {
    code: 'SECRET999',
    reward: {
      name: 'Secret Medallion',
      type: RewardType.EPIC,
      icon: '🏅',
      description: 'A secret reward for the curious explorers',
      actionType: ActionType.CODE_SCAN
    },
    location: 'Hidden Location',
    event: 'Easter Egg Hunt'
  }
];

export const getCodeData = (code: string): CodeData | undefined => {
  return validCodes.find(c => c.code.toLowerCase() === code.toLowerCase());
};

export const isCodeValid = (code: string): boolean => {
  const codeData = getCodeData(code);
  if (!codeData) return false;
  
  // Check if code is expired
  if (codeData.expiresAt && new Date() > codeData.expiresAt) {
    return false;
  }
  
  return true;
};

export const getCodesByLocation = (location: string): CodeData[] => {
  return validCodes.filter(c => 
    c.location?.toLowerCase().includes(location.toLowerCase())
  );
};

export const getCodesByEvent = (event: string): CodeData[] => {
  return validCodes.filter(c => 
    c.event?.toLowerCase().includes(event.toLowerCase())
  );
};

export const getCodesByRarity = (rarity: RewardType): CodeData[] => {
  return validCodes.filter(c => c.reward.type === rarity);
};

export const getActiveCodesCount = (): number => {
  return validCodes.filter(c => 
    !c.expiresAt || new Date() <= c.expiresAt
  ).length;
};

export const getExpiredCodesCount = (): number => {
  return validCodes.filter(c => 
    c.expiresAt && new Date() > c.expiresAt
  ).length;
};