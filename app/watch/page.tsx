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
} from "lucide-react";
import {
  videoLibrary,
  getVideosByCategory,
  getVideoStats,
} from "@/data/videos";
import { useMultiVideoProgress } from "@/hooks/useVideoProgress";
import VideoWatcher from "@/components/actions/VideoWatcher";
import { getRewardRarity } from "@/lib/utils";

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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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

  const selectedVideoData = selectedVideo
    ? videoLibrary.find((v) => v.id === selectedVideo)
    : null;

  if (selectedVideo && selectedVideoData) {
    return (
      <div className="">
        <div className="max-w-4xl mx-auto p-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="mb-6 flex items-center gap-2  transition-colors"
          >
            ← Back to Video Library
          </motion.button>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VideoWatcher
              video={selectedVideoData}
              onRewardEarned={() => {
                // Could add celebration here
              }}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold  mb-4">Video Library</h1>
          <p className="text-md  max-w-2xl mx-auto">
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
            className=" rounded-xl p-4 border  shadow-lg text-center"
          >
            <Film className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold ">{videoStats.total}</div>
            <div className="text-sm ">Total Videos</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className=" rounded-xl p-4 border  shadow-lg text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold ">{completedVideos.length}</div>
            <div className="text-sm ">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className=" rounded-xl p-4 border  shadow-lg text-center"
          >
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold ">
              {formatTotalWatchTime(totalWatchTime)}
            </div>
            <div className="text-sm ">Watch Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className=" rounded-xl p-4 border  shadow-lg text-center"
          >
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold ">{completedVideos.length}</div>
            <div className="text-sm ">Rewards Earned</div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className=" rounded-xl p-6 border  shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border  rounded-lg focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as CategoryFilter)
                }
                className="px-3 py-2 border  rounded-lg "
              >
                <option value="all">All Categories</option>
                <option value="nature">Nature</option>
                <option value="education">Education</option>
                <option value="art">Art & Culture</option>
                <option value="tech">Technology</option>
                <option value="quick">Quick Watch</option>
                <option value="special">Special</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border  rounded-lg "
              >
                <option value="title">Sort by Title</option>
                <option value="duration">Sort by Duration</option>
                <option value="rarity">Sort by Rarity</option>
                <option value="progress">Sort by Progress</option>
              </select>

              <div className="flex border  rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-500 "
                      : ""
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-purple-500"
                      : ""
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

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
              <Video className="w-16 h-16  mx-auto mb-4" />
              <h3 className="text-xl font-semibold  mb-2">
                No videos found
              </h3>
              <p className="">
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
                    onClick={() => setSelectedVideo(video.id)}
                    className={`
                      rounded-xl overflow-hidden border  shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl
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
                      <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 " />
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-1  bg-opacity-75 text-xs rounded">
                        {formatDuration(video.duration)}
                      </div>

                      {/* Completion Badge */}
                      {progress.completed && (
                        <div className="absolute top-2 left-2 bg-green-500  rounded-full p-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}

                      {/* Progress Bar */}
                      {progressPercentage > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 ">
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
                        <h3 className="font-semibold  line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="text-2xl ml-2">{video.reward.icon}</div>
                      </div>

                      <p className="text-sm  mb-3 line-clamp-2">
                        {video.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${rarity.color} bg-opacity-10`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              video.reward.type === "legendary"
                                ? "bg-yellow-500"
                                : video.reward.type === "epic"
                                ? "bg-purple-500"
                                : video.reward.type === "rare"
                                ? "bg-blue-500"
                                : video.reward.type === "special"
                                ? "bg-pink-500"
                                : "bg-gray-500"
                            }`}
                          />
                          {rarity.label}
                        </span>

                        <div className="flex items-center text-xs">
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
    </div>
  );
}
