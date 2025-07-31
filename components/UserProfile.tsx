"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Save,
  X,
  Settings,
  Trophy,
  Calendar,
  Bell,
  Volume2,
  VolumeX,
  Wallet,
  User,
  Crown,
  Star,
  Zap,
  Gift,
} from "lucide-react";
import { UserProfile as UserProfileType, RewardType } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import { formatDate } from "@/lib/utils";
import SoundControl from "./SoundControl";

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
  const { userProfile, updateUserProfile, getTotalRewards, getRewardsToday } =
    useRewards();
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<UserProfileType>(userProfile);

  const totalRewards = getTotalRewards();
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

  const handlePreferenceUpdate = (
    key: keyof UserProfileType["preferences"],
    value: string | boolean
  ) => {
    const updatedPreferences = { ...userProfile.preferences, [key]: value };
    updateUserProfile({ preferences: updatedPreferences });
  };

  const getMostCollectedType = (): { type: RewardType; count: number } => {
    const types = Object.entries(userProfile.rewardsByType) as [
      RewardType,
      number
    ][];
    const sorted = types.sort(([, a], [, b]) => b - a);
    return { type: sorted[0][0], count: sorted[0][1] };
  };

  const mostCollected = getMostCollectedType();

  const getStreakDays = (): number => {
    // Simple implementation - could be enhanced with actual streak tracking
    return Math.floor(totalRewards / 3) + 1;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header - Shadcn Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" rounded-2xl p-8 border "
      >
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {userProfile.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2  rounded-full" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold  mb-2">
                {userProfile.username}
              </h2>
              <p className=" flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {formatDate(userProfile.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-3  rounded-xl border   transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl  hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Stats Grid - Shadcn Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className=" backdrop-blur-sm rounded-xl p-4 border ">
            <div className="text-2xl font-bold  mb-1">
              {totalRewards}
            </div>
            <div className="text-sm ">Total Rewards</div>
          </div>
          <div className=" backdrop-blur-sm rounded-xl p-4 border ">
            <div className="text-2xl font-bold  mb-1">
              {todayRewards}
            </div>
            <div className="text-sm ">Today</div>
          </div>
          <div className=" backdrop-blur-sm rounded-xl p-4 border ">
            <div className="text-2xl font-bold  mb-1">
              {getStreakDays()}
            </div>
            <div className="text-sm ">Day Streak</div>
          </div>
          <div className=" backdrop-blur-sm rounded-xl p-4 border ">
            <div className="text-2xl font-bold  mb-1">
              {mostCollected.count}
            </div>
            <div className="text-sm ">
              {mostCollected.type}s
            </div>
          </div>
        </div>

        {/* Collection Breakdown - Shadcn Style */}
        <div>
          <h3 className="text-xl font-semibold  mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Collection Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(userProfile.rewardsByType).map(([type, count]) => {
              const percentage =
                totalRewards > 0 ? (count / totalRewards) * 100 : 0;
              const colors = {
                common: "bg-gray-500",
                rare: "bg-blue-500",
                epic: "bg-purple-500",
                legendary: "bg-yellow-500",
                special: "bg-pink-500",
              };

              return (
                <div
                  key={type}
                  className="flex items-center gap-4 p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/10"
                >
                  <div className="w-20 text-sm  capitalize font-medium">
                    {type}
                  </div>
                  <div className="flex-1 bg-black/30 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-3 rounded-full ${
                        colors[type as keyof typeof colors]
                      } shadow-lg`}
                    />
                  </div>
                  <div className="w-12 text-sm font-semibold">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

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
              className=" rounded-2xl p-8 max-w-md w-full border "
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold ">
                  Edit Profile
                </h3>
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
                            ? "bg-gradient-to-r from-purple-500 to-pink-500  shadow-lg"
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
              className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full border border-purple-500/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold ">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2   transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Notifications */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 " />
                    <span className="text-sm font-medium ">
                      Notifications
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handlePreferenceUpdate(
                        "notifications",
                        !userProfile.preferences.notifications
                      )
                    }
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      userProfile.preferences.notifications
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-black/50 border border-purple-500/30"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full  transition-transform ${
                        userProfile.preferences.notifications
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Sounds */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    {userProfile.preferences.sounds ? (
                      <Volume2 className="w-5 h-5 " />
                    ) : (
                      <VolumeX className="w-5 h-5 " />
                    )}
                    <span className="text-sm font-medium ">
                      Sound Effects
                    </span>
                  </div>
                  <SoundControl />
                </div>

                {/* Wallet Section (Placeholder for future) */}
                <div className="p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="w-5 h-5 " />
                    <span className="text-sm font-medium ">
                      Wallet
                    </span>
                  </div>
                  <p className="text-xs ">
                    Wallet integration coming soon...
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
