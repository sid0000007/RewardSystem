"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "./ui/progress";
import { Reward, RewardType, ActionType } from "@/types";
interface LocalVideoDemoProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  minWatchTime?: number;
  onRewardEarned?: () => void;
  totalDuration?: number;
  rewardData?: {
    name: string;
    type: RewardType;
    icon: string;
    description: string;
  };
}

export default function LocalVideoDemo({
  videoUrl,
  thumbnailUrl,
  title,
  description,
  minWatchTime = 15,
  onRewardEarned,
  totalDuration,
  rewardData,
}: LocalVideoDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [hasEarned, setHasEarned] = useState(false);
  const [lastVideoTime, setLastVideoTime] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      // Use totalDuration prop if provided, otherwise use video duration
      if (!totalDuration) {
        console.log("Video duration:", videoElement.duration);
      }
    };

    const handleTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      const isVideoPlaying = !videoElement.paused && !videoElement.ended;

      setCurrentTime(currentTime);

      // Track actual watch time (not just elapsed time)
      if (isVideoPlaying && currentTime > lastVideoTime) {
        const timeIncrement = currentTime - lastVideoTime;
        setWatchTime((prev) => {
          const newWatchTime = prev + timeIncrement;
          setIsEligible(newWatchTime >= minWatchTime);
          return newWatchTime;
        });
      }

      setLastVideoTime(currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, [lastVideoTime, minWatchTime]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const handleReward = () => {
    if (isEligible && !hasEarned) {
      setHasEarned(true);

      // Call the reward earned callback
      onRewardEarned?.();
      console.log("🎉 Reward earned!");
    }
  };

  const resetProgress = () => {
    setWatchTime(0);
    setIsEligible(false);
    setHasEarned(false);
    setLastVideoTime(0);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.min(
    totalDuration && totalDuration > 0 ? (watchTime / minWatchTime) * 100 : 0,
    100
  );

  // Create reward object for animation
  const reward: Reward = {
    id: `video-reward-${Date.now()}`,
    name: rewardData?.name || title,
    type: rewardData?.type || RewardType.COMMON,
    icon: rewardData?.icon || "🎬",
    description: rewardData?.description || `Reward for watching ${title}`,
    actionType: ActionType.VIDEO_WATCH,
    earnedAt: new Date(),
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          {/* Video Player */}
          <div className="relative rounded-md overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto"
              poster={thumbnailUrl}
              preload="metadata"
              playsInline
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 text-white right-0  p-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={togglePlay}
                  size="sm"
                  className=" bg-white text-black hover:bg-white/80"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <span className=" text-sm">
                  {formatTime(currentTime)} / {formatTime(totalDuration || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Watch Progress</span>
              <span>
                {formatTime(watchTime)} / {formatTime(minWatchTime)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress: {progressPercentage.toFixed(1)}%</span>
              <span>
                Required:{" "}
                {totalDuration
                  ? ((minWatchTime / totalDuration) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isEligible
                  ? hasEarned
                    ? "✅ Reward earned!"
                    : "🎉 Ready to claim reward!"
                  : `Need ${Math.max(0, minWatchTime - watchTime).toFixed(
                      1
                    )}s more`}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleReward}
                disabled={!isEligible || hasEarned}
                size="sm"
              >
                Claim Reward
              </Button>
              <Button onClick={resetProgress} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
