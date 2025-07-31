"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Play,
  Clock,
  Trophy,
  Search,
  Grid3X3,
  List,
  CheckCircle,
  Film,
  Eye,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  videoLibrary,
  getVideosByCategory,
  getVideoStats,
} from "@/data/videos";
import { useMultiVideoProgress } from "@/hooks/useVideoProgress";
import { getRewardRarity } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import VideoHistory from "@/components/VideoHistory";

type CategoryFilter =
  | "all"
  | "nature"
  | "education"
  | "art"
  | "tech"
  | "quick"
  | "special";
type ViewMode = "grid" | "list";
type SortOption = "title" | "duration" | "rarity" | "progress";

export default function WatchPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [searchQuery, setSearchQuery] = useState("");

  const { getVideoProgress, getCompletedVideos, getTotalWatchTime } =
    useMultiVideoProgress();

  const videoStats = getVideoStats();
  const completedVideos = getCompletedVideos();
  const totalWatchTime = getTotalWatchTime();

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let videos =
      categoryFilter === "all"
        ? videoLibrary
        : getVideosByCategory(categoryFilter);

    // Apply search filter
    if (searchQuery.trim()) {
      videos = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort videos
    videos.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "duration":
          return b.duration - a.duration;
        case "rarity":
          const rarityOrder = {
            legendary: 4,
            epic: 3,
            rare: 2,
            special: 1,
            common: 0,
          };
          return rarityOrder[b.reward.type] - rarityOrder[a.reward.type];
        case "progress":
          const progressA = getVideoProgress(a.id).watchTime;
          const progressB = getVideoProgress(b.id).watchTime;
          return progressB - progressA;
        default:
          return 0;
      }
    });

    return videos;
  }, [categoryFilter, searchQuery, sortBy, getVideoProgress]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  const formatTotalWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProgressPercentage = (videoId: string) => {
    const progress = getVideoProgress(videoId);
    const video = videoLibrary.find((v) => v.id === videoId);
    if (!video || video.duration === 0) return 0;
    return Math.min((progress.watchTime / video.duration) * 100, 100);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Video className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Video Library</h1>
        <p className="text-xl text-purple-300 max-w-2xl mx-auto">
          Watch videos for 15+ seconds to earn unique digital rewards and
          collectibles.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl text-center">
            <CardContent className="p-4">
              <Film className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {videoStats.total}
              </div>
              <div className="text-sm text-purple-300">Total Videos</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl text-center">
            <CardContent className="p-4">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {completedVideos.length}
              </div>
              <div className="text-sm text-purple-300">Completed</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl text-center">
            <CardContent className="p-4">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {formatTotalWatchTime(totalWatchTime)}
              </div>
              <div className="text-sm text-purple-300">Watch Time</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {completedVideos.length}
              </div>
              <div className="text-sm text-purple-300">Rewards Earned</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 backdrop-blur-sm border-purple-500/30 text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(value as CategoryFilter)
                }
              >
                <SelectTrigger className="w-[160px] bg-black/30 backdrop-blur-sm border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-purple-500/20"
                  >
                    All Categories
                  </SelectItem>
                  <SelectItem
                    value="nature"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Nature
                  </SelectItem>
                  <SelectItem
                    value="education"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Education
                  </SelectItem>
                  <SelectItem
                    value="art"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Art & Culture
                  </SelectItem>
                  <SelectItem
                    value="tech"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Technology
                  </SelectItem>
                  <SelectItem
                    value="quick"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Quick Watch
                  </SelectItem>
                  <SelectItem
                    value="special"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Special
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[160px] bg-black/30 backdrop-blur-sm border-purple-500/30 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                  <SelectItem
                    value="title"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Sort by Title
                  </SelectItem>
                  <SelectItem
                    value="duration"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Sort by Duration
                  </SelectItem>
                  <SelectItem
                    value="rarity"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Sort by Rarity
                  </SelectItem>
                  <SelectItem
                    value="progress"
                    className="text-white hover:bg-purple-500/20"
                  >
                    Sort by Progress
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-purple-500/30 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video History */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Video Grid/List */}
          <AnimatePresence mode="wait">
            {filteredVideos.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <Video className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No videos found
                </h3>
                <p className="text-purple-300">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="videos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredVideos.map((video, index) => {
                  const progress = getVideoProgress(video.id);
                  const progressPercentage = getProgressPercentage(video.id);
                  const rarity = getRewardRarity(video.reward.type);

                  return (
                    <motion.div
                      key={video.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() =>
                        window.open(`/watch/${video.id}`, "_blank")
                      }
                      className={`
                      bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-purple-500/20 hover:border-purple-500/40
                      ${
                        viewMode === "list" ? "flex items-center p-4 gap-4" : ""
                      }
                    `}
                    >
                      {/* Thumbnail */}
                      <div
                        className={`relative ${
                          viewMode === "list"
                            ? "w-32 h-20 flex-shrink-0"
                            : "aspect-video"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 text-white text-xs rounded">
                          {formatDuration(video.duration)}
                        </div>

                        {/* Completion Badge */}
                        {progress.completed && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}

                        {/* Progress Bar */}
                        {progressPercentage > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500/20">
                            <div
                              className="h-full bg-purple-500 transition-all"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white line-clamp-2">
                            {video.title}
                          </h3>
                          <div className="text-2xl ml-2">
                            {video.reward.icon}
                          </div>
                        </div>

                        <p className="text-sm text-purple-300 mb-3 line-clamp-2">
                          {video.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`${rarity.color} text-xs font-semibold px-2 py-1 rounded-full`}
                          >
                            {rarity.label}
                          </Badge>

                          <div className="flex items-center text-xs text-purple-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {Math.round(progress.watchTime)}s watched
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video History Sidebar */}
        <div className="lg:col-span-1">
          <VideoHistory />
        </div>
      </div>
    </div>
  );
}
