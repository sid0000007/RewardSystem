"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Play, CheckCircle, Calendar, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVideoById } from "@/data/videos";

interface VideoHistoryEntry {
  videoId: string;
  watchedAt: Date;
  watchTime: number;
  completed: boolean;
  rewardEarned?: string;
}

export default function VideoHistory() {
  const [history, setHistory] = useState<VideoHistoryEntry[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("video-watch-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const historyWithDates = parsed.map((entry: any) => ({
          ...entry,
          watchedAt: new Date(entry.watchedAt),
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error("Failed to parse video history:", error);
      }
    }
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const getStats = () => {
    const totalVideos = history.length;
    const completedVideos = history.filter((entry) => entry.completed).length;
    const totalWatchTime = history.reduce(
      (total, entry) => total + entry.watchTime,
      0
    );

    return {
      totalVideos,
      completedVideos,
      totalWatchTime: formatDuration(totalWatchTime),
    };
  };

  if (history.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-purple-400" />
            Watch History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <Play className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No videos watched yet
            </h3>
            <p className="text-purple-300 text-sm">
              Start watching videos to see your history here
            </p>
            <div className="mt-4 text-xs text-purple-400">
              Your watch history will appear here once you complete videos
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = getStats();

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-purple-400" />
            Watch History
          </CardTitle>
        </div>
        <div className="flex flex-col gap-4 text-xs text-purple-300 mt-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            <span>{stats.totalVideos} videos</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{stats.completedVideos} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span>{stats.totalWatchTime} total</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
          {history.map((entry, index) => {
            const video = getVideoById(entry.videoId);
            if (!video) return null;

            return (
              <motion.div
                key={`${entry.videoId}-${entry.watchedAt.getTime()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/40 hover:bg-black/40 transition-all duration-200"
              >
                {/* Video Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                    <span className="text-2xl">{video.reward.icon}</span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate text-sm">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-purple-300 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(entry.watchedAt)}</span>
                    <span className="text-purple-400">•</span>
                    <span>{formatDuration(entry.watchTime)} watched</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Export the function to add to history (can be called from VideoWatcher)
export const addVideoToHistory = (entry: VideoHistoryEntry) => {
  const savedHistory = localStorage.getItem("video-watch-history");
  let history: VideoHistoryEntry[] = [];

  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      history = parsed.map((item: any) => ({
        ...item,
        watchedAt: new Date(item.watchedAt),
      }));
    } catch (error) {
      console.error("Failed to parse video history:", error);
    }
  }

  const newHistory = [entry, ...history].slice(0, 50); // Keep last 50 entries
  localStorage.setItem("video-watch-history", JSON.stringify(newHistory));
};
