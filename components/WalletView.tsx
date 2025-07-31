"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Search,
  Grid3X3,
  List,
  Download,
  Upload,
  Coins,
  Sparkles,
} from "lucide-react";
import { RewardType, ActionType } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import RewardCard from "./RewardCard";

type SortOption = "newest" | "oldest" | "rarity" | "name";
type ViewMode = "grid" | "list";

export default function WalletView() {
  const {
    rewards,
    clearAllRewards,
    getTotalRewards,
    getRewardsByType,
    exportData,
    importData,
  } = useRewards();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RewardType | "all">("all");
  const [selectedAction, setSelectedAction] = useState<ActionType | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Filter and sort rewards
  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || reward.type === selectedType;
    const matchesAction =
      selectedAction === "all" || reward.actionType === selectedAction;

    return matchesSearch && matchesType && matchesAction;
  });

  const sortedRewards = [...filteredRewards].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      case "oldest":
        return new Date(a.earnedAt).getTime() - new Date(b.earnedAt).getTime();
      case "rarity":
        const rarityOrder = {
          legendary: 4,
          epic: 3,
          rare: 2,
          special: 1,
          common: 0,
        };
        return rarityOrder[b.type] - rarityOrder[a.type];
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleClearWallet = () => {
    clearAllRewards();
    setShowConfirmClear(false);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewards-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const result = importData(data);
        if (result.success) {
          alert("Data imported successfully!");
        } else {
          alert(`Import failed: ${result.message}`);
        }
      } catch {
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // Stats
  const totalRewards = getTotalRewards();
  const commonCount = getRewardsByType(RewardType.COMMON).length;
  const rareCount = getRewardsByType(RewardType.RARE).length;
  const epicCount = getRewardsByType(RewardType.EPIC).length;
  const legendaryCount = getRewardsByType(RewardType.LEGENDARY).length;
  const specialCount = getRewardsByType(RewardType.SPECIAL).length;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900  flex items-center gap-2">
            <Coins className="w-8 h-8 text-yellow-500" />
            My Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {totalRewards} reward{totalRewards !== 1 ? "s" : ""} collected
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500  rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <motion.label
              htmlFor="import-file"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500  rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import
            </motion.label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirmClear(true)}
            disabled={totalRewards === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500  rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Common",
            count: commonCount,
            color: "bg-gray-500",
            icon: "🪙",
          },
          { label: "Rare", count: rareCount, color: "bg-blue-500", icon: "💎" },
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
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className=" rounded-lg p-4 border "
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.count}</div>
            <div className="text-sm ">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg p-4 ">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border  rounded-lg focus:ring-2"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as RewardType | "all")
              }
              className="px-3 py-2 border  rounded-lg "
            >
              <option value="all">All Types</option>
              <option value={RewardType.COMMON}>Common</option>
              <option value={RewardType.RARE}>Rare</option>
              <option value={RewardType.EPIC}>Epic</option>
              <option value={RewardType.LEGENDARY}>Legendary</option>
              <option value={RewardType.SPECIAL}>Special</option>
            </select>

            <select
              value={selectedAction}
              onChange={(e) =>
                setSelectedAction(e.target.value as ActionType | "all")
              }
              className="px-3 py-2 border  rounded-lg "
            >
              <option value="all">All Actions</option>
              <option value={ActionType.CODE_SCAN}>Code Scan</option>
              <option value={ActionType.VIDEO_WATCH}>Video Watch</option>
              <option value={ActionType.LOCATION_CHECKIN}>
                Location Check-in
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border  rounded-lg "
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rarity">By Rarity</option>
              <option value="name">By Name</option>
            </select>

            <div className="flex border  rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-purple-500"
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

      {/* Rewards Grid/List */}
      <AnimatePresence mode="wait">
        {sortedRewards.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="mb-4">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark: mb-2">
                {rewards.length === 0
                  ? "No rewards yet!"
                  : "No matching rewards"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                {rewards.length === 0
                  ? "Start collecting rewards by scanning codes, watching videos, or checking in at locations."
                  : "Try adjusting your search or filter criteria to find rewards."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="rewards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {sortedRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  showDelete={true}
                  className={viewMode === "list" ? "flex items-center p-4" : ""}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmClear(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className=" dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900  mb-4">
                Clear All Rewards?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will permanently delete all {totalRewards} rewards from
                your wallet. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWallet}
                  className="flex-1 px-4 py-2 bg-red-500  rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
