import { create } from 'zustand';

import {
  Reward,
  UserProfile,
  CooldownState,
  ActionType,
  RewardType,
  VideoProgress,
  ActionResult
} from '@/types';

import {
  calculateCooldownEnd,
  checkActionCooldown,
  createReward
} from '@/lib/utils';
import { playRewardSound } from '@/lib/sounds';

interface RewardsState {
  rewards: Reward[];
  userProfile: UserProfile;
  cooldowns: CooldownState;
  videoProgress: Record<string, VideoProgress>;
  isLoading: boolean;
  error: string | null;
}

interface RewardsActions {
  addReward: (reward: Omit<Reward, 'id' | 'earnedAt'>) => ActionResult;
  removeReward: (rewardId: string) => void;
  clearAllRewards: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetUserProfile: () => void;
  setCooldown: (actionType: ActionType) => void;
  checkCooldown: (actionType: ActionType) => { isActive: boolean; timeRemaining: number; message: string };
  updateVideoProgress: (videoId: string, progress: Partial<VideoProgress>) => void;
  getVideoProgress: (videoId: string) => VideoProgress | undefined;
  getRewardsByType: (type: RewardType) => Reward[];
  getRewardsByAction: (actionType: ActionType) => Reward[];
  getTotalRewards: () => number;
  getRewardsToday: () => Reward[];
  checkDailyLogin: () => { isNewDay: boolean; lastLoginDate: string | null };
  exportData: () => string;
  importData: (data: string) => ActionResult;
  clearError: () => void;
  initializeStore: () => void;
}

type RewardsStore = RewardsState & RewardsActions;

const createDefaultUserProfile = (): UserProfile => ({
  id: crypto.randomUUID(),
  username: 'Collector',
  avatar: '👤',
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
    sounds: true
  }
});

const initialState: RewardsState = {
  rewards: [],
  userProfile: createDefaultUserProfile(),
  cooldowns: {
    [ActionType.CODE_SCAN]: null,
    [ActionType.VIDEO_WATCH]: null,
    [ActionType.LOCATION_CHECKIN]: null,
    [ActionType.DAILY_LOGIN]: null
  },
  videoProgress: {},
  isLoading: false,
  error: null
};



export const useRewards = create<RewardsStore>()(
  (set, get) => ({
    ...initialState,

    addReward: (rewardData) => {
      try {
        const state = get();

        // Ensure the reward has a proper ID
        const newReward = createReward(
          rewardData.name,
          rewardData.type,
          rewardData.icon,
          rewardData.description,
          rewardData.actionType,
          rewardData.metadata
        );

        // Check if reward with same ID already exists
        const existingReward = state.rewards.find(r => r.id === newReward.id);
        if (existingReward) {
          return {
            success: false,
            message: 'Reward already exists',
            error: 'Duplicate reward ID'
          };
        }

        const updatedRewards = [...state.rewards, newReward];
        const updatedProfile = {
          ...state.userProfile,
          totalRewards: state.userProfile.totalRewards + 1,
          rewardsByType: {
            ...state.userProfile.rewardsByType,
            [newReward.type]: state.userProfile.rewardsByType[newReward.type] + 1
          }
        };

        set({
          rewards: updatedRewards,
          userProfile: updatedProfile,
          error: null
        });

        // Save to localStorage immediately (like scan history does)
        try {
          localStorage.setItem('mint-rewards', JSON.stringify(updatedRewards));
          localStorage.setItem('mint-user-profile', JSON.stringify(updatedProfile));
          localStorage.setItem('mint-storage-data', JSON.stringify({
            lastUpdated: new Date(),
            version: '1.0.0'
          }));
        } catch (storageError) {
          console.error('Failed to save to localStorage:', storageError);
        }

        // Play reward sound effect
        playRewardSound(newReward.type).catch(() => {
          // Ignore sound errors silently
        });

        return {
          success: true,
          message: `${newReward.name} added to your wallet!`,
          reward: newReward
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add reward';
        set({ error: errorMessage });
        return {
          success: false,
          message: errorMessage,
          error: errorMessage
        };
      }
    },

    removeReward: (rewardId) => {
      const state = get();
      const rewardToRemove = state.rewards.find(r => r.id === rewardId);

      if (!rewardToRemove) return;

      const updatedRewards = state.rewards.filter(r => r.id !== rewardId);
      const updatedProfile = {
        ...state.userProfile,
        totalRewards: Math.max(0, state.userProfile.totalRewards - 1),
        rewardsByType: {
          ...state.userProfile.rewardsByType,
          [rewardToRemove.type]: Math.max(0, state.userProfile.rewardsByType[rewardToRemove.type] - 1)
        }
      };

      set({
        rewards: updatedRewards,
        userProfile: updatedProfile
      });

      // Save to localStorage immediately
      try {
        localStorage.setItem('mint-rewards', JSON.stringify(updatedRewards));
        localStorage.setItem('mint-user-profile', JSON.stringify(updatedProfile));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }
    },

    clearAllRewards: () => {
      const state = get();
      const clearedProfile = {
        ...state.userProfile,
        totalRewards: 0,
        rewardsByType: {
          [RewardType.COMMON]: 0,
          [RewardType.RARE]: 0,
          [RewardType.EPIC]: 0,
          [RewardType.LEGENDARY]: 0,
          [RewardType.SPECIAL]: 0
        }
      };

      set({
        rewards: [],
        userProfile: clearedProfile
      });

      // Clear all related localStorage data
      try {
        localStorage.setItem('mint-rewards', JSON.stringify([]));
        localStorage.setItem('mint-user-profile', JSON.stringify(clearedProfile));

        // Clear all video progress data (keys like video-progress-videoId)
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('video-progress-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Clear video watch history
        localStorage.removeItem('video-watch-history');

        // Clear scan history
        localStorage.removeItem('scan-history');

        // Clear all session storage video data
        const sessionKeysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith('video-sessions-')) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

        // Clear any other related data
        localStorage.removeItem('mint-last-login-date');

        console.log('All wallet data, video progress, and scan history cleared successfully');
      } catch (storageError) {
        console.error('Failed to clear localStorage:', storageError);
      }
    },

    updateUserProfile: (updates) => {
      const state = get();
      const updatedProfile = { ...state.userProfile, ...updates };

      // Ensure the updated profile maintains the correct structure
      const normalizedProfile = {
        ...updatedProfile,
        createdAt: updatedProfile.createdAt instanceof Date
          ? updatedProfile.createdAt
          : new Date(updatedProfile.createdAt),
        rewardsByType: {
          [RewardType.COMMON]: updatedProfile.rewardsByType?.[RewardType.COMMON] || 0,
          [RewardType.RARE]: updatedProfile.rewardsByType?.[RewardType.RARE] || 0,
          [RewardType.EPIC]: updatedProfile.rewardsByType?.[RewardType.EPIC] || 0,
          [RewardType.LEGENDARY]: updatedProfile.rewardsByType?.[RewardType.LEGENDARY] || 0,
          [RewardType.SPECIAL]: updatedProfile.rewardsByType?.[RewardType.SPECIAL] || 0
        },
        preferences: {
          ...updatedProfile.preferences,
          sounds: updatedProfile.preferences?.sounds !== false
        }
      };

      set({
        userProfile: normalizedProfile
      });

      // Save to localStorage immediately
      try {
        localStorage.setItem('mint-user-profile', JSON.stringify(normalizedProfile));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }
    },

    resetUserProfile: () => {
      set({
        userProfile: createDefaultUserProfile()
      });
    },

    setCooldown: (actionType) => {
      const state = get();
      const cooldownEnd = calculateCooldownEnd(actionType);
      set({
        cooldowns: {
          ...state.cooldowns,
          [actionType]: cooldownEnd
        }
      });
    },

    checkCooldown: (actionType) => {
      const state = get();
      return checkActionCooldown(state.cooldowns, actionType);
    },

    updateVideoProgress: (videoId, progress) => {
      const state = get();
      const currentProgress = state.videoProgress[videoId] || {
        videoId,
        watchTime: 0,
        totalDuration: 0,
        completed: false,
        lastWatched: new Date()
      };

      set({
        videoProgress: {
          ...state.videoProgress,
          [videoId]: {
            ...currentProgress,
            ...progress
          }
        }
      });
    },

    getVideoProgress: (videoId) => {
      const state = get();
      return state.videoProgress[videoId];
    },

    getRewardsByType: (type) => {
      const state = get();
      return state.rewards.filter(reward => reward.type === type);
    },

    getRewardsByAction: (actionType) => {
      const state = get();
      return state.rewards.filter(reward => reward.actionType === actionType);
    },

    getTotalRewards: () => {
      const state = get();
      return state.rewards.length;
    },

    getRewardsToday: () => {
      const state = get();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return state.rewards.filter(reward => {
        const rewardDate = new Date(reward.earnedAt);
        rewardDate.setHours(0, 0, 0, 0);
        return rewardDate.getTime() === today.getTime();
      });
    },

    exportData: () => {
      try {
        const state = get();
        return JSON.stringify({
          rewards: state.rewards,
          userProfile: state.userProfile,
          exportedAt: new Date().toISOString(),
          version: '1.0.0'
        }, null, 2);
      } catch (error) {
        const errorMessage = 'Failed to export data';
        set({ error: errorMessage + error });
        return '';
      }
    },

    importData: (data) => {
      try {
        const parsed = JSON.parse(data);

        if (!parsed.rewards || !parsed.userProfile) {
          throw new Error('Invalid data format');
        }

        // Ensure all rewards have proper IDs and dates
        const normalizedRewards = parsed.rewards.map((reward: Reward) => ({
          ...reward,
          id: reward.id || crypto.randomUUID(),
          earnedAt: reward.earnedAt instanceof Date
            ? reward.earnedAt
            : new Date(reward.earnedAt),
          metadata: reward.metadata || {}
        }));

        set({
          rewards: normalizedRewards,
          userProfile: parsed.userProfile,
          error: null
        });

        // Save to localStorage immediately
        try {
          localStorage.setItem('mint-rewards', JSON.stringify(normalizedRewards));
          localStorage.setItem('mint-user-profile', JSON.stringify(parsed.userProfile));
          localStorage.setItem('mint-storage-data', JSON.stringify({
            lastUpdated: new Date(),
            version: '1.0.0'
          }));
        } catch (storageError) {
          console.error('Failed to save to localStorage:', storageError);
        }

        return {
          success: true,
          message: 'Data imported successfully!'
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to import data';
        set({ error: errorMessage });
        return {
          success: false,
          message: errorMessage,
          error: errorMessage
        };
      }
    },

    clearError: () => {
      set({ error: null });
    },

    checkDailyLogin: () => {
      const today = new Date().toDateString();
      const lastLoginDate = localStorage.getItem('mint-last-login-date');

      if (lastLoginDate !== today) {
        // New day - update last login date
        localStorage.setItem('mint-last-login-date', today);
        return { isNewDay: true, lastLoginDate };
      }

      return { isNewDay: false, lastLoginDate };
    },

    initializeStore: () => {
      try {
        set({ isLoading: true });

        // Load directly from localStorage (same keys we save to)
        const storedRewards = localStorage.getItem('mint-rewards');
        const storedProfile = localStorage.getItem('mint-user-profile');

        let rewards: Reward[] = [];
        let userProfile: UserProfile = createDefaultUserProfile();

        // Parse rewards
        if (storedRewards) {
          try {
            const parsedRewards = JSON.parse(storedRewards);
            if (Array.isArray(parsedRewards)) {
              rewards = parsedRewards.map((reward: Reward) => ({
                ...reward,
                id: reward.id || crypto.randomUUID(),
                earnedAt: reward.earnedAt instanceof Date
                  ? reward.earnedAt
                  : new Date(reward.earnedAt),
                metadata: reward.metadata || {}
              }));
            }
          } catch (error) {
            console.error('Failed to parse stored rewards:', error);
          }
        }

        // Parse user profile
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile);
            userProfile = {
              ...parsedProfile,
              createdAt: parsedProfile.createdAt instanceof Date
                ? parsedProfile.createdAt
                : new Date(parsedProfile.createdAt),
              rewardsByType: {
                [RewardType.COMMON]: parsedProfile.rewardsByType?.[RewardType.COMMON] || 0,
                [RewardType.RARE]: parsedProfile.rewardsByType?.[RewardType.RARE] || 0,
                [RewardType.EPIC]: parsedProfile.rewardsByType?.[RewardType.EPIC] || 0,
                [RewardType.LEGENDARY]: parsedProfile.rewardsByType?.[RewardType.LEGENDARY] || 0,
                [RewardType.SPECIAL]: parsedProfile.rewardsByType?.[RewardType.SPECIAL] || 0
              },
              preferences: {
                theme: parsedProfile.preferences?.theme || 'auto',
                notifications: parsedProfile.preferences?.notifications !== false,
                sounds: parsedProfile.preferences?.sounds !== false
              }
            };
          } catch (error) {
            console.error('Failed to parse stored profile:', error);
          }
        }

        set({
          rewards,
          userProfile,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to initialize store:', error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize'
        });
      }
    }
  })
);