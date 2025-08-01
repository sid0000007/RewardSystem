"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Search,
  CheckCircle,
} from "lucide-react";
import {
  videoLibrary,
  getVideosByCategory,
  getVideoStats,
} from "@/data/videos";
import { useMultiVideoProgress } from "@/hooks/useVideoProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VideoHistory from "@/components/VideoHistory";
import { useRouter } from "next/navigation";
import CustomBadge from "@/components/Custombadge";

type CategoryFilter =
  | "all"
  | "nature"
  | "education"
  | "art"
  | "tech"
  | "quick"
  | "special";
type SortOption = "title" | "duration" | "rarity" | "progress";

export default function WatchPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [searchQuery, setSearchQuery] = useState("");

  const { getVideoProgress, getCompletedVideos, getTotalWatchTime } =
    useMultiVideoProgress();


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
    <div className="max-w-7xl mx-auto p-4">
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Video Library
            </h1>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
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
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="art">Art & Culture</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="quick">Quick Watch</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Sort by Title</SelectItem>
                    <SelectItem value="duration">Sort by Duration</SelectItem>
                    <SelectItem value="rarity">Sort by Rarity</SelectItem>
                    <SelectItem value="progress">Sort by Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video History */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Video Grid */}
            <AnimatePresence mode="wait">
              {filteredVideos.length === 0 ? (
                <motion.div
                  key="empty"                  
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredVideos.map((video, index) => {
                    const progress = getVideoProgress(video.id);
                    const progressPercentage = getProgressPercentage(video.id);

                    return (
                      <motion.div
                        key={video.id}
                        
                        onClick={() => router.push(`/watch/${video.id}`)}
                        className="bg-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Duration Badge */}
                          <div className="absolute bottom-2 right-2 bg-background/20 text-white px-2 py-1 text-xs rounded">
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
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                        

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold line-clamp-2">
                              {video.title}
                            </h3>
                            <div className="flex items-center justify-between">
                            <CustomBadge type={video.reward.type} />                           
                          </div>
                          </div>
                          

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {video.description}
                          </p>

                         
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video History Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <VideoHistory />
            {/* Stats Overview */}
            <div className=" gap-4">
              <motion.div                
              ></motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
