"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Clock, Trophy, Calendar, Eye } from "lucide-react";
import { getVideoById } from "@/data/videos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRewardRarity } from "@/lib/utils";
import { RewardType } from "@/types";
import LocalVideoDemo from "@/components/LocalVideoDemo";
import { useRewards } from "@/hooks/useRewards";
import { addVideoToHistory } from "@/components/VideoHistory";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const [video, setVideo] = useState(getVideoById(videoId));
  const { addReward } = useRewards();

  useEffect(() => {
    if (!video) {
      // Redirect to watch page if video not found
      router.replace("/watch");
      return;
    }
  }, [video, router]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="">Loading video...</p>
        </div>
      </div>
    );
  }

  const rarity = getRewardRarity(video.reward.type);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const handleRewardEarned = () => {
    // Add reward to user's wallet
    const result = addReward({
      name: video.reward.name,
      type: video.reward.type,
      icon: video.reward.icon,
      description: video.reward.description,
      actionType: video.reward.actionType,
    });

    if (result.success) {
      // Add to video history
      addVideoToHistory({
        videoId: video.id,
        watchedAt: new Date(),
        watchTime: video.minWatchTime,
        completed: true,
        rewardEarned: video.reward.name,
      });

      console.log("🎉 Reward earned:", video.reward.name);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2  transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Video Library
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <LocalVideoDemo
            videoUrl={video.url}
            title={video.title}
            description={video.description}
            minWatchTime={video.minWatchTime}
            onRewardEarned={handleRewardEarned}
            totalDuration={video.duration}
            rewardData={{
              name: video.reward.name,
              type: video.reward.type,
              icon: video.reward.icon,
              description: video.reward.description,
            }}
          />
        </motion.div>

        {/* Video Details Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Video Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Video Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Duration: {formatDuration(video.duration)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Minimum Watch: {video.minWatchTime}s</span>
              </div>
            </CardContent>
          </Card>

          {/* Reward Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Reward
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{video.reward.icon}</div>
                <div>
                  <h4 className="font-semibold">{video.reward.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {video.reward.description}
                  </p>
                </div>
              </div>

              <Badge
                variant="secondary"
                className={`${rarity.color} text-xs font-semibold px-2 py-1 rounded-full`}
              >
                {rarity.label}
              </Badge>
            </CardContent>
          </Card>

          {/* Video Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Video Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="capitalize">
                  {video.id.includes("nature")
                    ? "Nature"
                    : video.id.includes("education")
                    ? "Education"
                    : video.id.includes("art")
                    ? "Art & Culture"
                    : video.id.includes("tech")
                    ? "Technology"
                    : video.id.includes("quick")
                    ? "Quick Watch"
                    : video.id.includes("special")
                    ? "Special"
                    : "General"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Rarity</span>
                <span className="capitalize">{video.reward.type}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Reward Type</span>
                <span>Video Watch</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>
                  Watch for at least {video.minWatchTime} seconds to earn the
                  reward
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>You can pause and resume without losing progress</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Each video can only be completed once per session</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
