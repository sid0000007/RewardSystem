import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoProgress } from '@/types';

interface VideoSession {
  videoId: string;
  startTime: number;
  lastUpdateTime: number;
  accumulatedWatchTime: number;
  hasEarnedReward: boolean;
}

const STORAGE_KEY = 'video-progress';
const SESSION_STORAGE_KEY = 'video-sessions';

export const useVideoProgress = (videoId: string) => {
  const [progress, setProgress] = useState<VideoProgress>({
    videoId,
    watchTime: 0,
    totalDuration: 0,
    completed: false,
    lastWatched: new Date()
  });

  const [currentSession, setCurrentSession] = useState<VideoSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const isInitialized = useRef(false);
  const lastVideoTime = useRef<number>(0);

  // Load progress from localStorage
  useEffect(() => {
    if (isInitialized.current) return;

    const savedProgress = localStorage.getItem(`${STORAGE_KEY}-${videoId}`);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress({
          ...parsed,
          lastWatched: new Date(parsed.lastWatched)
        });
      } catch {
        // Ignore invalid data
      }
    }
    isInitialized.current = true;
  }, [videoId]);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: VideoProgress) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}-${videoId}`, JSON.stringify({
        ...newProgress,
        lastWatched: newProgress.lastWatched.toISOString()
      }));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  }, [videoId]);

  // Start video session
  const startSession = useCallback((totalDuration: number) => {
    if (isActive) return; // Prevent multiple sessions

    const session: VideoSession = {
      videoId,
      startTime: Date.now(),
      lastUpdateTime: Date.now(),
      accumulatedWatchTime: progress.watchTime,
      hasEarnedReward: progress.completed
    };

    setCurrentSession(session);
    setIsActive(true);
    lastVideoTime.current = 0;

    // Update total duration if not set or changed
    if (progress.totalDuration !== totalDuration) {
      const updatedProgress = {
        ...progress,
        totalDuration,
        lastWatched: new Date()
      };
      saveProgress(updatedProgress);
    }

    // Save session to sessionStorage for recovery
    try {
      sessionStorage.setItem(`${SESSION_STORAGE_KEY}-${videoId}`, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [videoId, progress, saveProgress, isActive]);

  // End video session
  const endSession = useCallback(() => {
    if (!currentSession) return;

    const finalWatchTime = currentSession.accumulatedWatchTime;
    const updatedProgress: VideoProgress = {
      ...progress,
      watchTime: finalWatchTime,
      completed: progress.completed || finalWatchTime >= 15, // 15 seconds minimum
      lastWatched: new Date()
    };

    saveProgress(updatedProgress);
    setCurrentSession(null);
    setIsActive(false);

    // Clear session storage
    try {
      sessionStorage.removeItem(`${SESSION_STORAGE_KEY}-${videoId}`);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }, [currentSession, progress, saveProgress, videoId]);

  // Update watch time during playback
  const updateWatchTime = useCallback((currentTime: number, isPlaying: boolean) => {
    if (!currentSession || !isActive) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - currentSession.lastUpdateTime;

    // Only count time if video is playing
    if (isPlaying && timeSinceLastUpdate > 0 && timeSinceLastUpdate < 15000) { // Max 15 seconds between updates
      // Calculate time increment based on actual video time difference
      const videoTimeDiff = Math.max(0, currentTime - lastVideoTime.current);
      const timeIncrement = Math.min(videoTimeDiff, timeSinceLastUpdate / 1000);

      if (timeIncrement > 0) {
        const newAccumulatedTime = currentSession.accumulatedWatchTime + timeIncrement;

        const updatedSession: VideoSession = {
          ...currentSession,
          lastUpdateTime: now,
          accumulatedWatchTime: newAccumulatedTime
        };

        setCurrentSession(updatedSession);

        // Update progress state for real-time UI updates
        const updatedProgress = {
          ...progress,
          watchTime: newAccumulatedTime,
          completed: progress.completed || newAccumulatedTime >= 15,
          lastWatched: new Date()
        };

        setProgress(updatedProgress);

        // Save to localStorage immediately for better persistence
        saveProgress(updatedProgress);

        // Update session storage
        try {
          sessionStorage.setItem(`${SESSION_STORAGE_KEY}-${videoId}`, JSON.stringify(updatedSession));
        } catch (error) {
          console.error('Failed to update session:', error);
        }

        // Log progress for debugging
        console.log(`Video progress: ${newAccumulatedTime.toFixed(1)}s / 15s (${((newAccumulatedTime / 15) * 100).toFixed(1)}%)`);
      }
    }

    // Update last video time
    lastVideoTime.current = currentTime;
  }, [currentSession, isActive, videoId, progress, saveProgress]);

  // Mark as completed (when reward is earned)
  const markCompleted = useCallback(() => {
    const updatedProgress: VideoProgress = {
      ...progress,
      completed: true,
      lastWatched: new Date()
    };
    saveProgress(updatedProgress);

    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        hasEarnedReward: true
      } : null);
    }
  }, [progress, saveProgress, currentSession]);

  // Reset progress (for debugging/admin purposes)
  const resetProgress = useCallback(() => {
    const resetProgress: VideoProgress = {
      videoId,
      watchTime: 0,
      totalDuration: progress.totalDuration,
      completed: false,
      lastWatched: new Date()
    };
    saveProgress(resetProgress);
    setCurrentSession(null);
    setIsActive(false);
    lastVideoTime.current = 0;

    try {
      sessionStorage.removeItem(`${SESSION_STORAGE_KEY}-${videoId}`);
    } catch (error) {
      console.error('Failed to clear session on reset:', error);
    }
  }, [videoId, progress.totalDuration, saveProgress]);

  // Get watch percentage
  const getWatchPercentage = useCallback(() => {
    if (progress.totalDuration === 0) return 0;
    return Math.min((progress.watchTime / progress.totalDuration) * 100, 100);
  }, [progress.watchTime, progress.totalDuration]);

  // Get minimum watch percentage (15 seconds)
  const getMinimumWatchPercentage = useCallback(() => {
    if (progress.totalDuration === 0) return 0;
    return Math.min((15 / progress.totalDuration) * 100, 100);
  }, [progress.totalDuration]);

  // Check if eligible for reward
  const isEligibleForReward = useCallback(() => {
    return progress.watchTime >= 15 && !progress.completed;
  }, [progress.watchTime, progress.completed]);

  // Get time remaining to earn reward
  const getTimeToReward = useCallback(() => {
    return Math.max(0, 15 - progress.watchTime);
  }, [progress.watchTime]);

  // Recover session on page reload
  useEffect(() => {
    if (isInitialized.current) return;

    try {
      const savedSession = sessionStorage.getItem(`${SESSION_STORAGE_KEY}-${videoId}`);
      if (savedSession) {
        const session: VideoSession = JSON.parse(savedSession);
        // Only recover if session is recent (within 1 hour) and not already active
        if (Date.now() - session.lastUpdateTime < 3600000 && !isActive) {
          setCurrentSession(session);
          setIsActive(true);
          lastVideoTime.current = 0;
        } else {
          // Clean up old session
          sessionStorage.removeItem(`${SESSION_STORAGE_KEY}-${videoId}`);
        }
      }
    } catch (error) {
      console.error('Failed to recover session:', error);
      // Clean up invalid session data
      try {
        sessionStorage.removeItem(`${SESSION_STORAGE_KEY}-${videoId}`);
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [videoId, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSession && isActive) {
        endSession();
      }
    };
  }, [currentSession, isActive, endSession]);

  return {
    progress,
    currentSession,
    isActive,
    startSession,
    endSession,
    updateWatchTime,
    markCompleted,
    resetProgress,
    getWatchPercentage,
    getMinimumWatchPercentage,
    isEligibleForReward,
    getTimeToReward
  };
};

// Hook for managing multiple video progress
export const useMultiVideoProgress = () => {
  const [progressMap, setProgressMap] = useState<Record<string, VideoProgress>>({});
  const isInitialized = useRef(false);

  // Load all video progress
  const loadAllProgress = useCallback(() => {
    if (isInitialized.current) return progressMap;

    const allProgress: Record<string, VideoProgress> = {};

    try {
      // Scan localStorage for video progress entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_KEY)) {
          const videoId = key.replace(`${STORAGE_KEY}-`, '');
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              allProgress[videoId] = {
                ...parsed,
                lastWatched: new Date(parsed.lastWatched)
              };
            } catch {
              // Ignore invalid data
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load video progress:', error);
    }

    setProgressMap(allProgress);
    isInitialized.current = true;
    return allProgress;
  }, [progressMap]);

  // Get progress for specific video
  const getVideoProgress = useCallback((videoId: string): VideoProgress => {
    return progressMap[videoId] || {
      videoId,
      watchTime: 0,
      totalDuration: 0,
      completed: false,
      lastWatched: new Date()
    };
  }, [progressMap]);

  // Get completed videos
  const getCompletedVideos = useCallback(() => {
    return Object.values(progressMap).filter(progress => progress.completed);
  }, [progressMap]);

  // Get total watch time across all videos
  const getTotalWatchTime = useCallback(() => {
    return Object.values(progressMap).reduce((total, progress) => total + progress.watchTime, 0);
  }, [progressMap]);

  // Clear all progress (for debugging)
  const clearAllProgress = useCallback(() => {
    try {
      Object.keys(progressMap).forEach(videoId => {
        localStorage.removeItem(`${STORAGE_KEY}-${videoId}`);
        sessionStorage.removeItem(`${SESSION_STORAGE_KEY}-${videoId}`);
      });
      setProgressMap({});
    } catch (error) {
      console.error('Failed to clear all progress:', error);
    }
  }, [progressMap]);

  // Load progress on mount
  useEffect(() => {
    loadAllProgress();
  }, [loadAllProgress]);

  return {
    progressMap,
    loadAllProgress,
    getVideoProgress,
    getCompletedVideos,
    getTotalWatchTime,
    clearAllProgress
  };
};