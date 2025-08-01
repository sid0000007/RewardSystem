import { format, formatDistanceToNow, isAfter, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Coordinates, Reward, RewardType, ActionType, CooldownState } from '@/types';

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
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

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const isWithinRadius = (
  userCoords: Coordinates,
  targetCoords: Coordinates,
  radius: number
): boolean => {
  const distance = calculateDistance(userCoords, targetCoords);
  return distance <= radius;
};

export const generateRewardId = (): string => {
  return uuidv4();
};

export const createReward = (
  name: string,
  type: RewardType,
  icon: string,
  description: string,
  actionType: ActionType,
  metadata?: Record<string, unknown>
): Reward => {
  return {
    id: generateRewardId(),
    name,
    type,
    icon,
    description,
    earnedAt: new Date(),
    actionType,
    metadata
  };
};

export const getRewardRarity = (type: RewardType): { color: string; label: string } => {
  const rarityMap = {
    [RewardType.COMMON]: { color: 'text-gray-600', label: 'Common' },
    [RewardType.RARE]: { color: 'text-blue-600', label: 'Rare' },
    [RewardType.EPIC]: { color: 'text-purple-600', label: 'Epic' },
    [RewardType.LEGENDARY]: { color: 'text-yellow-600', label: 'Legendary' },
    [RewardType.SPECIAL]: { color: 'text-pink-600', label: 'Special' }
  };
  return rarityMap[type];
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const COOLDOWN_DURATIONS = {
  [ActionType.CODE_SCAN]: 1, // 1 minute
  [ActionType.VIDEO_WATCH]: 1, // 1 minute  
  [ActionType.LOCATION_CHECKIN]: 1, // 1 minute
  [ActionType.DAILY_LOGIN]: 1440 // 24 hours (1440 minutes)
};

export const getCooldownDuration = (actionType: ActionType): number => {
  return COOLDOWN_DURATIONS[actionType];
};

export const calculateCooldownEnd = (actionType: ActionType): Date => {
  const minutes = getCooldownDuration(actionType);
  return addMinutes(new Date(), minutes);
};

export const isCooldownActive = (cooldownEnd: Date | null): boolean => {
  if (!cooldownEnd) return false;
  return isAfter(cooldownEnd, new Date());
};

export const getCooldownTimeRemaining = (cooldownEnd: Date | null): number => {
  if (!cooldownEnd || !isCooldownActive(cooldownEnd)) return 0;
  return Math.max(0, cooldownEnd.getTime() - Date.now());
};

export const formatCooldownTime = (milliseconds: number): string => {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const checkActionCooldown = (
  cooldownState: CooldownState,
  actionType: ActionType
): { isActive: boolean; timeRemaining: number; message: string } => {
  const cooldownEnd = cooldownState[actionType];
  const isActive = isCooldownActive(cooldownEnd);
  const timeRemaining = getCooldownTimeRemaining(cooldownEnd);

  return {
    isActive,
    timeRemaining,
    message: isActive
      ? `Please wait ${formatCooldownTime(timeRemaining)} before trying again`
      : 'Ready to use'
  };
};

export const generateRandomReward = (actionType: ActionType): Omit<Reward, 'id' | 'earnedAt'> => {
  const commonRewards = [
    { name: 'Bronze Coin', icon: '🪙', description: 'A basic reward coin' },
    { name: 'Small Gem', icon: '💎', description: 'A tiny precious stone' },
    { name: 'Sticker', icon: '🏷️', description: 'A collectible sticker' }
  ];

  const rareRewards = [
    { name: 'Silver Medal', icon: '🥈', description: 'A shiny silver medal' },
    { name: 'Crystal', icon: '💎', description: 'A mysterious crystal' },
    { name: 'Golden Key', icon: '🔑', description: 'A key to something special' }
  ];

  const epicRewards = [
    { name: 'Gold Trophy', icon: '🏆', description: 'A prestigious gold trophy' },
    { name: 'Magic Scroll', icon: '📜', description: 'An ancient scroll' },
    { name: 'Crown', icon: '👑', description: 'A royal crown' }
  ];

  const legendaryRewards = [
    { name: 'Dragon Egg', icon: '🥚', description: 'A rare dragon egg' },
    { name: 'Phoenix Feather', icon: '🪶', description: 'A magical phoenix feather' },
    { name: 'Eternal Flame', icon: '🔥', description: 'A flame that never dies' }
  ];

  const random = Math.random();
  let rewardPool: Array<{ name: string; icon: string; description: string }>;
  let type: RewardType;

  if (random < 0.6) {
    rewardPool = commonRewards;
    type = RewardType.COMMON;
  } else if (random < 0.85) {
    rewardPool = rareRewards;
    type = RewardType.RARE;
  } else if (random < 0.95) {
    rewardPool = epicRewards;
    type = RewardType.EPIC;
  } else {
    rewardPool = legendaryRewards;
    type = RewardType.LEGENDARY;
  }

  const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];

  return {
    ...reward,
    type,
    actionType
  };
};

export const validateCoordinates = (coords: Coordinates): boolean => {
  return (
    typeof coords.latitude === 'number' &&
    typeof coords.longitude === 'number' &&
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  );
};

export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let message = 'Unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const getProgressPercentage = (current: number, total: number): number => {
  return clamp((current / total) * 100, 0, 100);
};