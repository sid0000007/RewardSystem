import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
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
  loadStorageData,
  saveStorageData,
  StorageError
} from '@/lib/storage';
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
    theme: 'auto',
    notifications: true,
    sounds: true
  }
});

const initialState: RewardsState = {
  rewards: [],
  userProfile: createDefaultUserProfile(),
  cooldowns: {
    [ActionType.CODE_SCAN]: null,
    [ActionType.VIDEO_WATCH]: null,
    [ActionType.LOCATION_CHECKIN]: null
  },
  videoProgress: {},
  isLoading: false,
  error: null
};

const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const data = loadStorageData();
      return JSON.stringify({
        state: {
          rewards: data.rewards,
          userProfile: data.userProfile,
          cooldowns: initialState.cooldowns,
          videoProgress: {},
          isLoading: false,
          error: null
        },
        version: 0
      });
    } catch (error) {
      console.error('Failed to load from custom storage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      const state = parsed.state;

      if (state && state.rewards && state.userProfile) {
        // Ensure the user profile has the correct structure and Date objects
        const userProfile = {
          ...state.userProfile,
          createdAt: state.userProfile.createdAt instanceof Date
            ? state.userProfile.createdAt
            : new Date(state.userProfile.createdAt),
          // Ensure rewardsByType has all required fields
          rewardsByType: {
            [RewardType.COMMON]: state.userProfile.rewardsByType?.[RewardType.COMMON] || 0,
            [RewardType.RARE]: state.userProfile.rewardsByType?.[RewardType.RARE] || 0,
            [RewardType.EPIC]: state.userProfile.rewardsByType?.[RewardType.EPIC] || 0,
            [RewardType.LEGENDARY]: state.userProfile.rewardsByType?.[RewardType.LEGENDARY] || 0,
            [RewardType.SPECIAL]: state.userProfile.rewardsByType?.[RewardType.SPECIAL] || 0
          },
          // Ensure preferences has all required fields
          preferences: {
            theme: state.userProfile.preferences?.theme || 'auto',
            notifications: state.userProfile.preferences?.notifications !== false,
            sounds: state.userProfile.preferences?.sounds !== false
          }
        };

        // Ensure rewards have proper IDs and dates
        const rewards = state.rewards.map((reward: any) => ({
          ...reward,
          id: reward.id || crypto.randomUUID(),
          earnedAt: reward.earnedAt instanceof Date
            ? reward.earnedAt
            : new Date(reward.earnedAt),
          metadata: reward.metadata || {}
        }));

        saveStorageData({
          rewards,
          userProfile,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to save to custom storage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem('mint-rewards');
      localStorage.removeItem('mint-user-profile');
      localStorage.removeItem('mint-storage-data');
    } catch (error) {
      console.error('Failed to remove from custom storage:', error);
    }
  }
};

export const useRewards = create<RewardsStore>()(
  persist(
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
      },

      clearAllRewards: () => {
        const state = get();
        set({
          rewards: [],
          userProfile: {
            ...state.userProfile,
            totalRewards: 0,
            rewardsByType: {
              [RewardType.COMMON]: 0,
              [RewardType.RARE]: 0,
              [RewardType.EPIC]: 0,
              [RewardType.LEGENDARY]: 0,
              [RewardType.SPECIAL]: 0
            }
          }
        });
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
            theme: updatedProfile.preferences?.theme || 'auto',
            notifications: updatedProfile.preferences?.notifications !== false,
            sounds: updatedProfile.preferences?.sounds !== false
          }
        };

        set({
          userProfile: normalizedProfile
        });
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
          set({ error: errorMessage });
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
          const normalizedRewards = parsed.rewards.map((reward: any) => ({
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

      initializeStore: () => {
        try {
          set({ isLoading: true });
          const data = loadStorageData();

          // Ensure all rewards have proper IDs and dates
          const normalizedRewards = data.rewards.map((reward: any) => ({
            ...reward,
            id: reward.id || crypto.randomUUID(),
            earnedAt: reward.earnedAt instanceof Date
              ? reward.earnedAt
              : new Date(reward.earnedAt),
            metadata: reward.metadata || {}
          }));

          set({
            rewards: normalizedRewards,
            userProfile: data.userProfile,
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
    }),
    {
      name: 'rewards-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        rewards: state.rewards,
        userProfile: state.userProfile
      })
    }
  )
);