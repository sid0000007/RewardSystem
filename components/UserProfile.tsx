"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Save,
  X,
  Settings,
  Calendar,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { RewardType, UserProfile as UserProfileType } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import { formatDate } from "@/lib/utils";
import SoundControl from "./SoundControl";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface UserProfileProps {
  className?: string;
}

const avatarOptions = [
  "👤",
  "👨",
  "👩",
  "🧑",
  "👦",
  "👧",
  "👴",
  "👵",
  "🤵",
  "👸",
  "🦸",
  "🦹",
  "🧙",
  "🧚",
  "🎭",
  "🎨",
  "🐱",
  "🐶",
  "🐸",
  "🦊",
  "🐼",
  "🦄",
  "🌟",
  "⚡",
];

export default function UserProfile({ className = "" }: UserProfileProps) {
  const {
    userProfile,
    updateUserProfile,
    getTotalRewards,
    getRewardsToday,
    getRewardsByType,   
  } = useRewards();
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<UserProfileType>(userProfile);

  const todayRewards = getRewardsToday().length;

  const handleSave = () => {
    updateUserProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatar: string) => {
    setEditedProfile((prev) => ({ ...prev, avatar }));
  };

  const getStreakDays = (): number => {
    // Simple implementation - could be enhanced with actual streak tracking
    return Math.floor(totalRewards / 3) + 1;
  };
  const {} = useRewards();
  // Stats
  const totalRewards = getTotalRewards();
  const commonCount = getRewardsByType(RewardType.COMMON).length;
  const rareCount = getRewardsByType(RewardType.RARE).length;
  const epicCount = getRewardsByType(RewardType.EPIC).length;
  const legendaryCount = getRewardsByType(RewardType.LEGENDARY).length;
  const specialCount = getRewardsByType(RewardType.SPECIAL).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header - Shadcn Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-8 border"
      >
        <div className="flex flex-col lg:flex-row gap-4  items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {userProfile.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2  rounded-full" />
              </div>
            </div>
            <div>
              <h2 className="text-xl lg:text-3xl font-bold  mb-2">
                {userProfile.username}
              </h2>
              <p className=" flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {formatDate(userProfile.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <ThemeToggle />
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="lg"
              className="p-3 rounded-xl border-2  transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="lg"
              className="p-3 rounded-xl border-2  transition-all duration-200"
            >
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats Grid - Shadcn Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-muted rounded-xl p-4 border">
            <div className="text-2xl font-bold mb-1">{totalRewards}</div>
            <div className="text-sm text-muted-foreground">Total Rewards</div>
          </div>
          <div className="bg-muted rounded-xl p-4 border">
            <div className="text-2xl font-bold mb-1">{todayRewards}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>
          <div className="bg-muted rounded-xl p-4 border">
            <div className="text-2xl font-bold mb-1">{getStreakDays()}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 gap-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-2">
            <div className="flex flex-col items-center text-center">
              <span className="text-base mb-0.5">💰</span>
              <div className="text-sm font-bold">
                {commonCount +
                  rareCount +
                  epicCount +
                  legendaryCount +
                  specialCount}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Token Cards */}
        {[
          {
            label: "Common",
            count: commonCount,
            color: "bg-gray-500",
            icon: "🪙",
          },
          {
            label: "Rare",
            count: rareCount,
            color: "bg-blue-500",
            icon: "💎",
          },
          {
            label: "Epic",
            count: epicCount,
            color: "bg-purple-500",
            icon: "🏆",
          },
          {
            label: "Legendary",
            count: legendaryCount,
            color: "bg-yellow-500",
            icon: "👑",
          },
          {
            label: "Special",
            count: specialCount,
            color: "bg-pink-500",
            icon: "✨",
          },
        ].map((token) => (
          <Card key={token.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-2">
              <div className="flex flex-col items-center text-center">
                <span className="text-base mb-0.5">{token.icon}</span>
                <div className="text-sm font-bold">{token.count}</div>
                <div className="text-xs text-muted-foreground">
                  {token.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Profile Modal - Shadcn Style */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-8 max-w-md w-full border"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold ">Edit Profile</h3>
                <button
                  onClick={handleCancel}
                  className="p-2  transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium  mb-3">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editedProfile.username}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3  border  rounded-xl  transition-all duration-200"
                    maxLength={50}
                    placeholder="Enter username..."
                  />
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium  mb-3">
                    Avatar
                  </label>
                  <div className="grid grid-cols-8 gap-3">
                    {avatarOptions.map((avatar) => (
                      <motion.button
                        key={avatar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAvatarSelect(avatar)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-200 ${
                          editedProfile.avatar === avatar
                            ? "bg-gradient-to-r   shadow-lg"
                            : " border"
                        }`}
                      >
                        {avatar}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3  border  rounded-xl  transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3  rounded-xl  transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal - Shadcn Style (No Theme Option) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-8 max-w-sm w-full border"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold ">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2  transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Sounds */}
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    {userProfile.preferences.sounds ? (
                      <Volume2 className="w-5 h-5 " />
                    ) : (
                      <VolumeX className="w-5 h-5 " />
                    )}
                    <span className="text-sm font-medium ">Sound Effects</span>
                  </div>
                  <SoundControl />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
