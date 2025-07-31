export enum RewardType {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  SPECIAL = 'special'
}

export enum ActionType {
  CODE_SCAN = 'code_scan',
  VIDEO_WATCH = 'video_watch',
  LOCATION_CHECKIN = 'location_checkin'
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Reward {
  id: string;
  name: string;
  type: RewardType;
  icon: string;
  description: string;
  earnedAt: Date;
  actionType: ActionType;
  metadata?: {
    code?: string;
    location?: string;
    event?: string;
    videoId?: string;
    videoTitle?: string;
    locationId?: string;
    locationName?: string;
    watchTime?: number;
    distance?: number;
    coordinates?: Coordinates;
    checkedInAt?: string;
    videoDuration?: number;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  createdAt: Date;
  totalRewards: number;
  rewardsByType: Record<RewardType, number>;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    sounds: boolean;
  };
}

export interface ActionResult {
  success: boolean;
  message: string;
  reward?: Reward;
  cooldownUntil?: Date;
  error?: string;
}

export interface StorageData {
  rewards: Reward[];
  userProfile: UserProfile;
  lastUpdated: Date;
}

export interface CooldownState {
  [ActionType.CODE_SCAN]: Date | null;
  [ActionType.VIDEO_WATCH]: Date | null;
  [ActionType.LOCATION_CHECKIN]: Date | null;
}

export interface VideoProgress {
  videoId: string;
  watchTime: number;
  totalDuration: number;
  completed: boolean;
  lastWatched: Date;
}

export interface LocationData {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinates;
  radius: number;
  reward: Omit<Reward, 'id' | 'earnedAt'>;
}

export interface CodeData {
  code: string;
  reward: Omit<Reward, 'id' | 'earnedAt'>;
  location?: string;
  event?: string;
  maxUses?: number;
  expiresAt?: Date;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  reward: Omit<Reward, 'id' | 'earnedAt'>;
  minWatchTime: number;
}