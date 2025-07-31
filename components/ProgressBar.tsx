"use client";

import { motion } from "framer-motion";
import { Check, Clock, Target } from "lucide-react";

interface ProgressBarProps {
  progress: number; // 0-100
  minRequired?: number; // 0-100, marks the minimum threshold
  label?: string;
  showPercentage?: boolean;
  showMinimumLine?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "purple" | "yellow" | "red";
  animated?: boolean;
  completed?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  minRequired = 0,
  label,
  showPercentage = true,
  showMinimumLine = true,
  size = "md",
  color = "blue",
  animated = true,
  completed = false,
  className = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const clampedMinRequired = Math.min(Math.max(minRequired, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      gradient: "from-blue-400 to-blue-600",
      light: "bg-blue-100 dark:bg-blue-900",
    },
    green: {
      bg: "bg-green-500",
      gradient: "from-green-400 to-green-600",
      light: "bg-green-100 dark:bg-green-900",
    },
    purple: {
      bg: "bg-purple-500",
      gradient: "from-purple-400 to-purple-600",
      light: "bg-purple-100 dark:bg-purple-900",
    },
    yellow: {
      bg: "bg-yellow-500",
      gradient: "from-yellow-400 to-yellow-600",
      light: "bg-yellow-100 dark:bg-yellow-900",
    },
    red: {
      bg: "bg-red-500",
      gradient: "from-red-400 to-red-600",
      light: "bg-red-100 dark:bg-red-900",
    },
  };

  const currentColorClass = colorClasses[color];
  const finalColorClass = completed ? colorClasses.green : currentColorClass;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              {completed ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-gray-500" />
              )}
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              className={`font-semibold ${
                completed
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background */}
        <div
          className={`
          w-full ${sizeClasses[size]} 
          bg-gray-200 dark:bg-gray-700 
          rounded-full 
          overflow-hidden
          ${animated ? "transition-all duration-300" : ""}
        `}
        >
          {/* Progress Fill */}
          <motion.div
            className={`
              h-full rounded-full
              ${
                animated
                  ? `bg-gradient-to-r ${finalColorClass.gradient}`
                  : finalColorClass.bg
              }
              ${animated ? "shadow-sm" : ""}
            `}
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{
              duration: animated ? 0.8 : 0,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          />

          {/* Shimmer effect for active progress */}
          {animated &&
            clampedProgress > 0 &&
            clampedProgress < 100 &&
            !completed && (
              <motion.div
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
                style={{ width: `${clampedProgress}%` }}
              />
            )}
        </div>

        {/* Minimum Required Line */}
        {showMinimumLine && clampedMinRequired > 0 && (
          <div
            className="absolute top-0 h-full w-0.5 bg-red-500 dark:bg-red-400 z-10 flex items-center"
            style={{ left: `${clampedMinRequired}%` }}
          >
            {/* Minimum marker */}
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full" />
              {size !== "sm" && (
                <div className="absolute -top-6 -left-6 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 whitespace-nowrap">
                  <Target className="w-3 h-3" />
                  <span>Min</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion Indicator */}
        {completed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <div className="bg-green-500  rounded-full p-1">
              <Check className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Status Text */}
      {minRequired > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {clampedProgress >= clampedMinRequired ? (
              <span className="text-green-600 dark:text-green-400 font-medium">
                ✓ Minimum reached
              </span>
            ) : (
              <span>
                Need {Math.round(clampedMinRequired - clampedProgress)}% more
              </span>
            )}
          </span>
          {minRequired > 0 && (
            <span>Required: {Math.round(clampedMinRequired)}%</span>
          )}
        </div>
      )}
    </div>
  );
}

// Specialized component for video watch progress
interface VideoProgressBarProps {
  watchTime: number; // in seconds
  totalDuration: number; // in seconds
  minWatchTime?: number; // in seconds, default 15
  completed?: boolean;
  className?: string;
}

export function VideoProgressBar({
  watchTime,
  totalDuration,
  minWatchTime = 15,
  completed = false,
  className = "",
}: VideoProgressBarProps) {
  const progress = totalDuration > 0 ? (watchTime / totalDuration) * 100 : 0;
  const minRequired =
    totalDuration > 0 ? (minWatchTime / totalDuration) * 100 : 100;
  const isEligible = watchTime >= minWatchTime;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Watch Progress
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {formatTime(watchTime)} / {formatTime(totalDuration)}
        </span>
      </div>

      <ProgressBar
        progress={progress}
        minRequired={minRequired}
        color={isEligible || completed ? "green" : "purple"}
        completed={completed || isEligible}
        showPercentage={false}
        showMinimumLine={true}
        size="md"
        animated={true}
      />

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {isEligible ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ Reward available
            </span>
          ) : (
            <span>{formatTime(minWatchTime - watchTime)} more needed</span>
          )}
        </span>
        <span>Minimum: {formatTime(minWatchTime)}</span>
      </div>
    </div>
  );
}
