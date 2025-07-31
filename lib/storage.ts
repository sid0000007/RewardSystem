import { Reward, UserProfile, StorageData, RewardType } from '@/types';

const STORAGE_KEYS = {
  REWARDS: 'mint-rewards',
  USER_PROFILE: 'mint-user-profile',
  STORAGE_DATA: 'mint-storage-data'
} as const;

export class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

const createDefaultUserProfile = (): UserProfile => ({
  id: crypto.randomUUID(),
  username: 'Collector',
  avatar: '=d',
  createdAt: new Date(),
  totalRewards: 0,
  rewardsByType: {
    [RewardType.COMMON]: 0,
    [RewardType.RARE]: 0,
    [RewardType.EPIC]: 0,
    [RewardType.LEGENDARY]: 0,
    [RewardType.SPECIAL]: 0
  },
  preferences: {
    theme: 'auto' as const,
    notifications: true,
    sounds: true
  }
});

const isValidReward = (reward: unknown): reward is Reward => {
  return (
    typeof reward === 'object' &&
    reward !== null &&
    typeof (reward as Record<string, unknown>).id === 'string' &&
    typeof (reward as Record<string, unknown>).name === 'string' &&
    Object.values(RewardType).includes((reward as Record<string, unknown>).type as RewardType) &&
    typeof (reward as Record<string, unknown>).icon === 'string' &&
    typeof (reward as Record<string, unknown>).description === 'string' &&
    (reward as Record<string, unknown>).earnedAt instanceof Date
  );
};

const isValidUserProfile = (profile: unknown): profile is UserProfile => {
  if (
    typeof profile !== 'object' ||
    profile === null
  ) {
    return false;
  }

  const p = profile as Record<string, unknown>;

  // Check basic fields
  if (
    typeof p.id !== 'string' ||
    typeof p.username !== 'string' ||
    typeof p.avatar !== 'string' ||
    !(p.createdAt instanceof Date) ||
    typeof p.totalRewards !== 'number'
  ) {
    return false;
  }

  // Check rewardsByType structure
  if (
    typeof p.rewardsByType !== 'object' ||
    p.rewardsByType === null
  ) {
    return false;
  }

  const rewardsByType = p.rewardsByType as Record<string, unknown>;
  const requiredTypes = [RewardType.COMMON, RewardType.RARE, RewardType.EPIC, RewardType.LEGENDARY, RewardType.SPECIAL];

  for (const type of requiredTypes) {
    if (typeof rewardsByType[type] !== 'number') {
      return false;
    }
  }

  // Check preferences structure
  if (
    typeof p.preferences !== 'object' ||
    p.preferences === null
  ) {
    return false;
  }

  const preferences = p.preferences as Record<string, unknown>;
  if (
    typeof preferences.theme !== 'string' ||
    typeof preferences.notifications !== 'boolean' ||
    typeof preferences.sounds !== 'boolean'
  ) {
    return false;
  }

  return true;
};

export const saveRewards = (rewards: Reward[]): void => {
  try {
    if (!Array.isArray(rewards)) {
      throw new StorageError('Rewards must be an array');
    }

    const validRewards = rewards.filter(isValidReward);
    if (validRewards.length !== rewards.length) {
      console.warn('Some invalid rewards were filtered out');
    }

    const serializedRewards = JSON.stringify(validRewards, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });

    localStorage.setItem(STORAGE_KEYS.REWARDS, serializedRewards);
  } catch (error) {
    throw new StorageError(
      `Failed to save rewards: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

export const loadRewards = (): Reward[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REWARDS);
    if (!stored) return [];

    const parsed = JSON.parse(stored, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });

    if (!Array.isArray(parsed)) {
      console.warn('Invalid rewards data format, returning empty array');
      return [];
    }

    return parsed.filter(isValidReward);
  } catch (error) {
    console.error('Failed to load rewards:', error);
    return [];
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    if (!isValidUserProfile(profile)) {
      console.error('Invalid user profile data:', {
        profile,
        hasId: typeof (profile as UserProfile)?.id === 'string',
        hasUsername: typeof (profile as UserProfile)?.username === 'string',
        hasAvatar: typeof (profile as UserProfile)?.avatar === 'string',
        hasCreatedAt: (profile as UserProfile)?.createdAt instanceof Date,
        hasTotalRewards: typeof (profile as UserProfile)?.totalRewards === 'number',
        hasRewardsByType: typeof (profile as UserProfile)?.rewardsByType === 'object',
        hasPreferences: typeof (profile as UserProfile)?.preferences === 'object',
        rewardsByTypeKeys: (profile as UserProfile)?.rewardsByType ? Object.keys((profile as UserProfile).rewardsByType) : [],
        preferencesKeys: (profile as UserProfile)?.preferences ? Object.keys((profile as UserProfile).preferences) : []
      });
      throw new StorageError('Invalid user profile data');
    }

    const serializedProfile = JSON.stringify(profile, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });

    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, serializedProfile);
  } catch (error) {
    throw new StorageError(
      `Failed to save user profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

export const loadUserProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!stored) return createDefaultUserProfile();

    const parsed = JSON.parse(stored, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });

    // Try to normalize the profile data if it's partially valid
    if (parsed && typeof parsed === 'object') {
      const normalized = {
        id: typeof parsed.id === 'string' ? parsed.id : crypto.randomUUID(),
        username: typeof parsed.username === 'string' ? parsed.username : 'Collector',
        avatar: typeof parsed.avatar === 'string' ? parsed.avatar : '👤',
        createdAt: parsed.createdAt instanceof Date ? parsed.createdAt : new Date(),
        totalRewards: typeof parsed.totalRewards === 'number' ? parsed.totalRewards : 0,
        rewardsByType: {
          [RewardType.COMMON]: parsed.rewardsByType?.[RewardType.COMMON] || 0,
          [RewardType.RARE]: parsed.rewardsByType?.[RewardType.RARE] || 0,
          [RewardType.EPIC]: parsed.rewardsByType?.[RewardType.EPIC] || 0,
          [RewardType.LEGENDARY]: parsed.rewardsByType?.[RewardType.LEGENDARY] || 0,
          [RewardType.SPECIAL]: parsed.rewardsByType?.[RewardType.SPECIAL] || 0
        },
        preferences: {
          theme: parsed.preferences?.theme === 'light' || parsed.preferences?.theme === 'dark' || parsed.preferences?.theme === 'auto'
            ? parsed.preferences.theme
            : 'auto',
          notifications: parsed.preferences?.notifications !== false,
          sounds: parsed.preferences?.sounds !== false
        }
      };

      if (isValidUserProfile(normalized)) {
        return normalized;
      }
    }

    console.warn('Invalid user profile data, creating default profile');
    return createDefaultUserProfile();
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return createDefaultUserProfile();
  }
};

export const saveStorageData = (data: StorageData): void => {
  try {
    saveRewards(data.rewards);
    saveUserProfile(data.userProfile);

    const metadata = {
      lastUpdated: data.lastUpdated,
      version: '1.0.0'
    };

    localStorage.setItem(STORAGE_KEYS.STORAGE_DATA, JSON.stringify(metadata, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    }));
  } catch (error) {
    throw new StorageError(
      `Failed to save storage data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

export const loadStorageData = (): StorageData => {
  try {
    const rewards = loadRewards();
    const userProfile = loadUserProfile();

    const metadata = localStorage.getItem(STORAGE_KEYS.STORAGE_DATA);
    let lastUpdated = new Date();

    if (metadata) {
      try {
        const parsed = JSON.parse(metadata, (key, value) => {
          if (value && typeof value === 'object' && value.__type === 'Date') {
            return new Date(value.value);
          }
          return value;
        });
        if (parsed.lastUpdated instanceof Date) {
          lastUpdated = parsed.lastUpdated;
        }
      } catch {
        console.warn('Invalid metadata format');
      }
    }

    return {
      rewards,
      userProfile,
      lastUpdated
    };
  } catch (error) {
    console.error('Failed to load storage data:', error);
    return {
      rewards: [],
      userProfile: createDefaultUserProfile(),
      lastUpdated: new Date()
    };
  }
};

export const clearStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    throw new StorageError(
      `Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

export const getStorageSize = (): number => {
  try {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    return totalSize;
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
    return 0;
  }
};

export const exportData = (): string => {
  try {
    const data = loadStorageData();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new StorageError(
      `Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

export const importData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });

    if (!data.rewards || !data.userProfile) {
      throw new StorageError('Invalid import data format');
    }

    saveStorageData({
      rewards: data.rewards,
      userProfile: data.userProfile,
      lastUpdated: new Date()
    });
  } catch (error) {
    throw new StorageError(
      `Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};