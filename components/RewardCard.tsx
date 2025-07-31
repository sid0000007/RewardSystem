"use client";

import { motion } from "framer-motion";
import { Trash2, Clock, MapPin, Video, QrCode } from "lucide-react";
import { Reward, ActionType } from "@/types";
import { formatRelativeTime, getRewardRarity } from "@/lib/utils";
import { useRewards } from "@/hooks/useRewards";

interface RewardCardProps {
  reward: Reward;
  onDelete?: (rewardId: string) => void;
  showDelete?: boolean;
  className?: string;
}

const getActionIcon = (actionType: ActionType) => {
  switch (actionType) {
    case ActionType.CODE_SCAN:
      return <QrCode className="w-4 h-4" />;
    case ActionType.VIDEO_WATCH:
      return <Video className="w-4 h-4" />;
    case ActionType.LOCATION_CHECKIN:
      return <MapPin className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getActionLabel = (actionType: ActionType) => {
  switch (actionType) {
    case ActionType.CODE_SCAN:
      return "Code Scan";
    case ActionType.VIDEO_WATCH:
      return "Video Watch";
    case ActionType.LOCATION_CHECKIN:
      return "Location Check-in";
    default:
      return "Unknown";
  }
};

export default function RewardCard({
  reward,
  onDelete,
  showDelete = false,
  className = "",
}: RewardCardProps) {
  const { removeReward } = useRewards();
  const rarity = getRewardRarity(reward.type);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(reward.id);
    } else {
      removeReward(reward.id);
    }
  };

  const isListView = className.includes("flex items-center");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group cursor-pointer
        bg-gray-800 
        rounded-xl shadow-lg hover:shadow-xl
        border border-gray-200 dark:border-gray-700
        overflow-hidden
        transition-all duration-300
        ${className}
      `}
    >
      {/* Rarity Border Glow */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
          reward.type === "legendary"
            ? "from-yellow-400 via-yellow-500 to-orange-500"
            : reward.type === "epic"
            ? "from-purple-400 via-purple-500 to-pink-500"
            : reward.type === "rare"
            ? "from-blue-400 via-blue-500 to-cyan-500"
            : reward.type === "special"
            ? "from-pink-400 via-pink-500 to-rose-500"
            : "from-gray-400 via-gray-500 to-gray-600"
        } opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
      />

      {/* Delete Button */}
      {showDelete && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          className="absolute top-2 right-2 z-10 p-1.5 bg-red-500  rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
          aria-label="Delete reward"
        >
          <Trash2 className="w-3 h-3" />
        </motion.button>
      )}

      <div
        className={`relative z-10 ${
          isListView ? "flex items-center gap-4 w-full" : "p-4"
        }`}
      >
        {/* Icon and Rarity */}
        <div
          className={`flex items-start justify-between ${
            isListView ? "flex-shrink-0" : "mb-3"
          }`}
        >
          <div className="relative">
            <div
              className={`${
                isListView ? "text-3xl" : "text-4xl mb-2"
              } transform group-hover:scale-110 transition-transform duration-200`}
            >
              {reward.icon}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                reward.type === "legendary"
                  ? "bg-yellow-500"
                  : reward.type === "epic"
                  ? "bg-purple-500"
                  : reward.type === "rare"
                  ? "bg-blue-500"
                  : reward.type === "special"
                  ? "bg-pink-500"
                  : "bg-gray-500"
              } ring-2 ring-white dark:ring-gray-800`}
            />
          </div>

          {!isListView && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              {getActionIcon(reward.actionType)}
              <span>{getActionLabel(reward.actionType)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`${isListView ? "flex-1 min-w-0" : ""}`}>
          {/* Reward Name */}
          <h3
            className={`font-semibold text-gray-900  ${
              isListView ? "mb-1" : "mb-1"
            } group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 truncate`}
          >
            {reward.name}
          </h3>

          {/* Description */}
          <p
            className={`text-sm text-gray-600 dark:text-gray-300 ${
              isListView ? "mb-2" : "mb-3"
            } line-clamp-2`}
          >
            {reward.description}
          </p>

          {/* Rarity Badge and Time */}
          <div
            className={`flex items-center justify-between ${
              isListView ? "flex-wrap gap-2" : ""
            }`}
          >
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${rarity.color} bg-opacity-10 flex-shrink-0`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-1 ${
                  reward.type === "legendary"
                    ? "bg-yellow-500"
                    : reward.type === "epic"
                    ? "bg-purple-500"
                    : reward.type === "rare"
                    ? "bg-blue-500"
                    : reward.type === "special"
                    ? "bg-pink-500"
                    : "bg-gray-500"
                }`}
              />
              {rarity.label}
            </span>

            {/* Time Earned */}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatRelativeTime(reward.earnedAt)}</span>
            </div>
          </div>

          {/* Action Type for List View */}
          {isListView && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getActionIcon(reward.actionType)}
              <span>{getActionLabel(reward.actionType)}</span>
            </div>
          )}

          {/* Metadata Display */}
          {reward.metadata && (
            <div
              className={`${
                isListView
                  ? "mt-2"
                  : "mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex flex-wrap gap-1">
                {reward.metadata.code && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    Code: {reward.metadata.code}
                  </span>
                )}
                {reward.metadata.watchTime && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    Watched: {Math.round(reward.metadata.watchTime)}s
                  </span>
                )}
                {reward.metadata.distance && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    Distance: {Math.round(reward.metadata.distance)}m
                  </span>
                )}
                {reward.metadata.locationName && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {reward.metadata.locationName}
                  </span>
                )}
                {reward.metadata.videoTitle && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {reward.metadata.videoTitle}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sparkle Animation for Rare+ Rewards */}
      {(reward.type === "rare" ||
        reward.type === "epic" ||
        reward.type === "legendary" ||
        reward.type === "special") && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1  rounded-full"
              initial={{
                opacity: 0,
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
