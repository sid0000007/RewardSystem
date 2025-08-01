import React from "react";
import { Badge } from "@/components/ui/badge";
import { getRarityColor } from "@/lib/getbgColour";
import { RewardType } from "@/types";

interface CustomBadgeProps {
  type: RewardType;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function CustomBadge({ type, variant = "default" }: CustomBadgeProps) {
  // Define custom colors for different reward types - matching the image colors
  const getBadgeStyle = (rewardType: RewardType) => {
    switch (rewardType) {
      case RewardType.COMMON:
        return "bg-amber-50 text-amber-800 border-amber-200";
      case RewardType.RARE:
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case RewardType.EPIC:
        return "bg-violet-50 text-violet-800 border-violet-200";
      case RewardType.LEGENDARY:
        return "bg-red-100 text-red-800 border-red-200 ";
      case RewardType.SPECIAL:
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={` py-1 rounded-md text-xs text-center font-medium border ${getBadgeStyle(
        type
      )}`}
    >
      {type}
    </div>
  );
}

export default CustomBadge;
