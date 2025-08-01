"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Search,
  Download,
  Upload,
  Sparkles,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { RewardType, ActionType } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomBadge from "./Custombadge";

type SortOption = "newest" | "oldest" | "rarity" | "name";

export default function WalletView() {
  const {
    rewards,
    clearAllRewards,
    getTotalRewards,
    getRewardsByType,
    exportData,
    importData,
    removeReward,
  } = useRewards();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RewardType | "all">("all");
  const [selectedAction, setSelectedAction] = useState<ActionType | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
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

  const handleDeleteReward = (rewardId: string) => {
    removeReward(rewardId);
  };

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

  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case ActionType.CODE_SCAN:
        return "📱";
      case ActionType.VIDEO_WATCH:
        return "📺";
      case ActionType.LOCATION_CHECKIN:
        return "📍";
      case ActionType.DAILY_LOGIN:
        return "🌅";
      default:
        return "🎯";
    }
  };

  // Stats
  const totalRewards = getTotalRewards();
  const commonCount = getRewardsByType(RewardType.COMMON).length;
  const rareCount = getRewardsByType(RewardType.RARE).length;
  const epicCount = getRewardsByType(RewardType.EPIC).length;
  const legendaryCount = getRewardsByType(RewardType.LEGENDARY).length;
  const specialCount = getRewardsByType(RewardType.SPECIAL).length;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
            My Wallet
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="lg:w-4 lg:h-4 w-3 h-3   mr-2" />
            Export
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <Button asChild variant="outline" size="sm">
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="lg:w-4 lg:h-4 w-3 h-3     mr-2" />
                Import
              </label>
            </Button>
          </div>

          <Button
            onClick={() => setShowConfirmClear(true)}
            disabled={totalRewards === 0}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="lg:w-4 lg:h-4 w-2 h-2  mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* stats sections  */}
      <div className="  hidden lg:grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 gap-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-2">
            <div className="flex flex-col items-center text-center">
              <span className="text-base lg:text-2xl mb-0.5">💰</span>
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
      {/* Filters and Search */}
      <Card>
        <CardContent className="">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 lg:w-4 lg:h-4 w-3 h-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap text-sm lg:text-base">
              <Select
                value={selectedType}
                onValueChange={(value: string) =>
                  setSelectedType(value as RewardType | "all")
                }
              >
                <SelectTrigger className="lg:w-[140px] w-[100px] text-sm lg:text-base">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={RewardType.COMMON}>Common</SelectItem>
                  <SelectItem value={RewardType.RARE}>Rare</SelectItem>
                  <SelectItem value={RewardType.EPIC}>Epic</SelectItem>
                  <SelectItem value={RewardType.LEGENDARY}>
                    Legendary
                  </SelectItem>
                  <SelectItem value={RewardType.SPECIAL}>Special</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedAction}
                onValueChange={(value: string) =>
                  setSelectedAction(value as ActionType | "all")
                }
              >
                <SelectTrigger className="lg:w-[140px] w-[100px] text-sm lg:text-base">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value={ActionType.CODE_SCAN}>
                    Code Scan
                  </SelectItem>
                  <SelectItem value={ActionType.VIDEO_WATCH}>
                    Video Watch
                  </SelectItem>
                  <SelectItem value={ActionType.LOCATION_CHECKIN}>
                    Location Check-in
                  </SelectItem>
                  <SelectItem value={ActionType.DAILY_LOGIN}>
                    Daily Login
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: string) =>
                  setSortBy(value as SortOption)
                }
              >
                <SelectTrigger className="lg:w-[140px] w-[100px] text-sm lg:text-base">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="rarity">By Rarity</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Display */}
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
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {rewards.length === 0
                  ? "No rewards yet!"
                  : "No matching rewards"}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {rewards.length === 0
                  ? "Start collecting rewards by scanning codes, watching videos, or checking in at locations."
                  : "Try adjusting your search or filter criteria to find rewards."}
              </p>
            </div>
          </motion.div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reward</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Earned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{reward.icon}</div>
                          <div>
                            <div className="font-medium">{reward.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {reward.description}
                            </div>
                            {reward.metadata?.code && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Code: {reward.metadata.code}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CustomBadge type={reward.type} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getActionIcon(reward.actionType)}
                          </span>
                          <span className="text-sm capitalize">
                            {reward.actionType.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(reward.earnedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteReward(reward.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmClear(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg p-6 max-w-sm w-full border"
            >
              <h3 className="text-lg font-semibold mb-4">Clear All Rewards?</h3>
              <p className="text-muted-foreground mb-6">
                This will permanently delete all {totalRewards} rewards from
                your wallet. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearWallet}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
