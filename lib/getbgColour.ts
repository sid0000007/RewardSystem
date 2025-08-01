
export const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case "common":
            return "text-gray-400";
        case "rare":
            return "text-blue-500";
        case "epic":
            return "text-purple-500";
        case "legendary":
            return "text-yellow-500";
        case "special":
            return "text-pink-500";
        default:
            return "text-gray-200";
    }
};

export const getStatusStyles = (cardStatus: string) => {
  switch (cardStatus) {
    case "checked-in":
      return {
        border: "border-success",
        bg: "bg-success/10",
        glow: "shadow-success/20",
      };
    case "available":
      return {
        border: "border-primary",
        bg: "bg-primary/10",
        glow: "shadow-primary/20",
      };
    case "nearby":
      return {
        border: "border-warning",
        bg: "bg-warning/10",
        glow: "shadow-warning/20",
      };
    default:
      return {
        border: "border-muted",
        bg: "bg-background",
        glow: "shadow-muted/20",
      };
  }
};
