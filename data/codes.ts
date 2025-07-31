import { CodeData, RewardType, ActionType } from '@/types';

// German Snack Brands and Products - Enhanced with detailed information
const snackProducts = [
  // Lays Products
  {
    id: 'lays-classic-200g',
    brand: 'Lays',
    name: 'Lays Classic Blue 200g',
    code: 'LAYS-CLASSIC-200G',
    rarity: RewardType.COMMON,
    icon: '🥔',
    description: 'Classic salted potato chips in a family size pack',
    reward: 'Lays Classic Coin',
    rewardDescription: 'A golden coin featuring the classic Lays logo',
    image: '/images/products/lays-classic-200g.png',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Haribo Products
  {
    id: 'haribo-goldbaren-100g',
    brand: 'Haribo',
    name: 'Haribo Goldbären 100g',
    code: 'HARIBO-GOLDBAREN-100G',
    rarity: RewardType.COMMON,
    icon: '🐻',
    description: 'Famous gummy bears in a classic pack',
    reward: 'Golden Bear Badge',
    rewardDescription: 'A shiny badge featuring the iconic golden bear',
    image: '/images/products/haribo-goldbaren-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Milka Products
  {
    id: 'milka-alpine-100g',
    brand: 'Milka',
    name: 'Milka Alpine Milk 100g',
    code: 'MILKA-ALPINE-100G',
    rarity: RewardType.RARE,
    icon: '🍫',
    description: 'Smooth Alpine milk chocolate in a standard bar',
    reward: 'Alpine Chocolate Token',
    rewardDescription: 'A special token with Alpine mountain design',
    image: '/images/products/milka-alpine-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Kinder Products
  {
    id: 'kinder-schokolade-100g',
    brand: 'Kinder',
    name: 'Kinder Schokolade 100g',
    code: 'KINDER-SCHOKOLADE-100G',
    rarity: RewardType.RARE,
    icon: '🍫',
    description: 'Creamy milk chocolate with a smooth filling',
    reward: 'Kinder Chocolate Medal',
    rewardDescription: 'A golden medal with Kinder chocolate design',
    image: '/images/products/kinder-schokolade-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Ritter Sport Products
  {
    id: 'ritter-sport-alpine-100g',
    brand: 'Ritter Sport',
    name: 'Ritter Sport Alpine Milk 100g',
    code: 'RITTER-ALPINE-100G',
    rarity: RewardType.RARE,
    icon: '🍫',
    description: 'Premium Alpine milk chocolate in square format',
    reward: 'Ritter Sport Trophy',
    rewardDescription: 'A prestigious trophy with Ritter Sport branding',
    image: '/images/products/ritter-sport-alpine-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Pringles Products
  {
    id: 'pringles-original-110g',
    brand: 'Pringles',
    name: 'Pringles Original 110g',
    code: 'PRINGLES-ORIGINAL-110G',
    rarity: RewardType.COMMON,
    icon: '🥔',
    description: 'Original flavored potato crisps in iconic tube',
    reward: 'Pringles Stack Coin',
    rewardDescription: 'A coin featuring the iconic Pringles stack',
    image: '/images/products/pringles-original-110g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // M&Ms Products
  {
    id: 'mandms-chocolate-100g',
    brand: 'M&Ms',
    name: 'M&Ms Chocolate 100g',
    code: 'MANDMS-CHOCOLATE-100G',
    rarity: RewardType.RARE,
    icon: '🍫',
    description: 'Colorful chocolate candies in a standard pack',
    reward: 'M&M Rainbow Badge',
    rewardDescription: 'A colorful badge featuring M&M characters',
    image: '/images/products/mandms-chocolate-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Snickers Products
  {
    id: 'snickers-100g',
    brand: 'Snickers',
    name: 'Snickers 100g',
    code: 'SNICKERS-100G',
    rarity: RewardType.RARE,
    icon: '🍫',
    description: 'Satisfying chocolate bar with peanuts and caramel',
    reward: 'Snickers Energy Token',
    rewardDescription: 'A token representing the energy of Snickers',
    image: '/images/products/snickers-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Twix Products
  {
    id: 'twix-100g',
    brand: 'Twix',
    name: 'Twix 100g',
    code: 'TWIX-100G',
    rarity: RewardType.RARE,
    icon: '🍫',
    description: 'Caramel and cookie covered in milk chocolate',
    reward: 'Twix Duo Badge',
    rewardDescription: 'A badge featuring the iconic Twix duo design',
    image: '/images/products/twix-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  },

  // Doritos Products
  {
    id: 'doritos-nacho-100g',
    brand: 'Doritos',
    name: 'Doritos Nacho Cheese 100g',
    code: 'DORITOS-NACHO-100G',
    rarity: RewardType.COMMON,
    icon: '🧀',
    description: 'Bold nacho cheese flavored tortilla chips',
    reward: 'Doritos Nacho Token',
    rewardDescription: 'A token featuring the bold nacho cheese flavor',
    image: '/images/products/doritos-nacho-100g.jpg',
    expiryDate: '2024-12-31',
    schemeDetails: 'Valid until December 31, 2024. One reward per code.'
  }
];

// Generate demo codes - one per product for testing
const generateSnackCodes = (): CodeData[] => {
  const codes: CodeData[] = [];

  // Generate one demo code per product
  for (const product of snackProducts) {
    const demoCode = `${product.code}-DEMO`;

    codes.push({
      code: demoCode,
      reward: {
        name: `${product.name} Reward`,
        type: product.rarity,
        icon: product.icon,
        description: `Collectible reward from ${product.name}`,
        actionType: ActionType.CODE_SCAN
      },
      location: 'German Supermarket',
      event: 'Snack Collection Campaign',
      maxUses: 1
    });
  }

  // Add some special/legendary codes for variety
  const specialCodes = [
    {
      code: 'LAYS-GOLDEN-500G-DEMO',
      reward: {
        name: 'Golden Lays Trophy',
        type: RewardType.LEGENDARY,
        icon: '🏆',
        description: 'Ultra rare golden Lays collectible',
        actionType: ActionType.CODE_SCAN
      },
      location: 'German Supermarket',
      event: 'Snack Collection Campaign',
      maxUses: 1
    },
    {
      code: 'HARIBO-DIAMOND-1000G-DEMO',
      reward: {
        name: 'Diamond Haribo Crown',
        type: RewardType.LEGENDARY,
        icon: '👑',
        description: 'The rarest Haribo collectible ever',
        actionType: ActionType.CODE_SCAN
      },
      location: 'German Supermarket',
      event: 'Snack Collection Campaign',
      maxUses: 1
    },
    {
      code: 'MILKA-PLATINUM-500G-DEMO',
      reward: {
        name: 'Platinum Milka Bar',
        type: RewardType.LEGENDARY,
        icon: '💎',
        description: 'Exclusive platinum Milka collectible',
        actionType: ActionType.CODE_SCAN
      },
      location: 'German Supermarket',
      event: 'Snack Collection Campaign',
      maxUses: 1
    }
  ];

  codes.push(...specialCodes);

  return codes;
};

export const validCodes: CodeData[] = generateSnackCodes();

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

// Helper function to get all available snack products for display
export const getAvailableSnackProducts = () => {
  return snackProducts;
};

// Helper function to get codes by brand
export const getCodesByBrand = (brand: string): CodeData[] => {
  return validCodes.filter(c =>
    c.reward.name.toLowerCase().includes(brand.toLowerCase())
  );
};

// Helper function to get product by ID
export const getProductById = (id: string) => {
  return snackProducts.find(product => product.id === id);
};

// Helper function to get all products
export const getAllProducts = () => {
  return snackProducts;
};