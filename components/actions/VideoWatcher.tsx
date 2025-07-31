"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { VideoData, ActionType, Reward } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { VideoProgressBar } from "@/components/ProgressBar";
import { formatCooldownTime } from "@/lib/utils";
import { playActionSound } from "@/lib/sounds";
import RewardAnimation from "@/components/RewardAnimation";
import { addVideoToHistory } from "@/components/VideoHistory";

interface VideoWatcherProps {
  video: VideoData;
  onRewardEarned?: () => void;
  className?: string;
}

// Local video fallback for reliability
const FALLBACK_VIDEOS = [
  "/videos/quick-tips.mp4",
  "/videos/cooking-demo.mp4",
  "/videos/nature-forest.mp4",
];

export default function VideoWatcher({
  video,
  onRewardEarned,
  className = "",
}: VideoWatcherProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [earnedReward, setEarnedReward] = useState<Reward | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(video.url);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const { addReward, setCooldown, checkCooldown } = useRewards();

  const {
    progress,
    isActive,
    startSession,
    endSession,
    updateWatchTime,
    markCompleted,
    resetProgress,
    isEligibleForReward,
    getTimeToReward,
  } = useVideoProgress(video.id);

  const cooldownStatus = checkCooldown(ActionType.VIDEO_WATCH);

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      const videoDuration = videoElement.duration;
      if (videoDuration && isFinite(videoDuration)) {
        setDuration(videoDuration);
        setIsLoading(false);
        startSession(videoDuration);
        console.log(`Video loaded: ${videoDuration}s duration`);
      } else {
        setError("Invalid video duration");
        setIsLoading(false);
      }
    };

    const handleTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      if (isFinite(currentTime)) {
        setCurrentTime(currentTime);

        // Update watch time based on actual video playback
        const isVideoPlaying = !videoElement.paused && !videoElement.ended;
        updateWatchTime(currentTime, isVideoPlaying);

        // Enhanced debug logging for progress tracking
        if (Math.floor(currentTime) % 5 === 0 && currentTime > 0) {
          // Log every 5 seconds
          console.log(
            `Video time: ${currentTime.toFixed(
              1
            )}s, Progress: ${progress.watchTime.toFixed(
              1
            )}s, Playing: ${isVideoPlaying}, Eligible: ${isEligibleForReward()}`
          );
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log("Video started playing");
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log("Video paused");
    };

    const handleEnded = () => {
      setIsPlaying(false);
      endSession();

      // Add to history even if not completed
      if (progress.watchTime > 0) {
        addVideoToHistory({
          videoId: video.id,
          watchedAt: new Date(),
          watchTime: progress.watchTime,
          completed: progress.completed,
          rewardEarned: progress.completed ? video.reward.name : undefined,
        });
      }

      console.log("Video ended");
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setError("Failed to load video. Trying fallback...");
      setIsLoading(false);

      // Try fallback video
      if (fallbackIndex < FALLBACK_VIDEOS.length) {
        setTimeout(() => {
          setCurrentVideoUrl(FALLBACK_VIDEOS[fallbackIndex]);
          setFallbackIndex((prev) => prev + 1);
          setError(null);
          setIsLoading(true);
          videoElement.load();
        }, 1000);
      } else {
        setError("All video sources failed to load. Please try again later.");
      }
    };

    const handleVolumeChange = () => {
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("error", handleError);
    videoElement.addEventListener("volumechange", handleVolumeChange);
    videoElement.addEventListener("canplay", handleCanPlay);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("error", handleError);
      videoElement.removeEventListener("volumechange", handleVolumeChange);
      videoElement.removeEventListener("canplay", handleCanPlay);
    };
  }, [
    startSession,
    endSession,
    updateWatchTime,
    fallbackIndex,
    progress.watchTime,
  ]);

  // Check for reward eligibility
  useEffect(() => {
    const checkAndEarnReward = async () => {
      if (isEligibleForReward() && !cooldownStatus.isActive) {
        const result = addReward({
          ...video.reward,
          metadata: {
            videoId: video.id,
            watchTime: progress.watchTime,
            videoTitle: video.title,
            videoDuration: duration,
          },
        });

        if (result.success) {
          markCompleted();
          setCooldown(ActionType.VIDEO_WATCH);

          // Add to video history
          addVideoToHistory({
            videoId: video.id,
            watchedAt: new Date(),
            watchTime: progress.watchTime,
            completed: true,
            rewardEarned: result.reward?.name,
          });

          // Play video completion sound
          playActionSound(ActionType.VIDEO_WATCH, true).catch(() => {});

          setEarnedReward(result.reward || null);
          setShowRewardAnimation(true);
          setTimeout(() => setShowRewardAnimation(false), 3000);
          onRewardEarned?.();
        }
      }
    };

    // Check immediately when progress updates
    if (progress.watchTime >= 15 && !progress.completed) {
      checkAndEarnReward();
    }
  }, [
    progress.watchTime,
    progress.completed,
    cooldownStatus.isActive,
    isEligibleForReward,
    addReward,
    video.reward,
    video.id,
    video.title,
    duration,
    markCompleted,
    setCooldown,
    onRewardEarned,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        endSession();
      }
    };
  }, [isActive, endSession]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play().catch(() => {
        setError("Failed to play video. Please try again.");
      });
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
  };

  const handleVolumeChange = (newVolume: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleFullscreen = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      if (!isFullscreen) {
        await videoElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  };

  const handleSeek = (seekTime: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Detect seeking and reset progress if seeking backwards
    const currentTime = videoElement.currentTime;
    if (seekTime < currentTime) {
      console.log(
        `Seeking detected: ${currentTime.toFixed(1)}s → ${seekTime.toFixed(1)}s`
      );
      // Reset progress if seeking backwards (anti-cheat measure)
      resetProgress();
    }

    videoElement.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleReset = () => {
    resetProgress();
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = 0;
      setCurrentTime(0);
    }
    console.log("Progress reset to 0");
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setFallbackIndex(0);
    setCurrentVideoUrl(video.url);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={` rounded-xl overflow-hidden border  shadow-lg ${className}`}
    >
      {/* Video Player */}
      <div className="relative bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center ">
            <div className=" text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4  border-t-transparent rounded-full mx-auto mb-4"
              />
              <p>Loading video...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className=" text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500  rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-auto max-h-96"
          poster={video.thumbnail}
          preload="metadata"
          playsInline
          muted={isMuted}
        >
          <source src={currentVideoUrl} type="video/mp4" />
          {FALLBACK_VIDEOS.map((url, index) => (
            <source key={index} src={url} type="video/mp4" />
          ))}
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay */}
        {!isLoading && !error && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div
                className="w-full h-1  rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * duration);
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs  mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="  transition-colors">
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="transition-colors">
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-16 h-1 bg-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className=" transition-colors"
                  title="Reset Progress"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    console.log(
                      `Current progress: ${progress.watchTime.toFixed(
                        1
                      )}s / 15s`
                    );
                    console.log(
                      `Video time: ${currentTime.toFixed(
                        1
                      )}s / ${duration.toFixed(1)}s`
                    );
                    console.log(`Is playing: ${isPlaying}`);
                  }}
                  className=" transition-colors"
                  title="Debug Progress"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info and Progress */}
      <div className="p-6 space-y-4">
        {/* Video Details */}
        <div>
          <h3 className="text-xl font-bold  mb-2">{video.title}</h3>
          <p className=" mb-4">{video.description}</p>
        </div>

        {/* Watch Progress */}
        <VideoProgressBar
          watchTime={progress.watchTime}
          totalDuration={duration || video.duration}
          minWatchTime={video.minWatchTime}
          completed={progress.completed}
        />

        {/* Reward Status */}
        <div className=" rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold  flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Reward Status
            </h4>
            {progress.completed && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">{video.reward.icon}</div>
            <div>
              <div className="font-medium t">{video.reward.name}</div>
              <div className="text-sm">{video.reward.description}</div>
            </div>
          </div>

          {/* Status Messages */}
          {progress.completed ? (
            <div className="flex items-center gap-2 ">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Reward earned!</span>
            </div>
          ) : cooldownStatus.isActive ? (
            <div className="flex items-center gap-2 ">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Cooldown: {formatCooldownTime(cooldownStatus.timeRemaining)}
              </span>
            </div>
          ) : isEligibleForReward() ? (
            <div className="flex items-center gap-2 ">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">
                Ready to claim reward!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 ">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Watch {Math.ceil(getTimeToReward())} more seconds to earn reward
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showRewardAnimation && earnedReward && (
          <RewardAnimation
            reward={earnedReward}
            onComplete={() => setShowRewardAnimation(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
