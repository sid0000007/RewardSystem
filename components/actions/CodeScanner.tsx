"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, X, Clock, Search, Package, Copy } from "lucide-react";
import { useRewards } from "@/hooks/useRewards";
import { ActionType, Reward } from "@/types";
import {
  getCodeData,
  isCodeValid,
  getAvailableSnackProducts,
} from "@/data/codes";
import { formatCooldownTime } from "@/lib/utils";
import { playActionSound } from "@/lib/sounds";

import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import CustomBadge from "../Custombadge";
import CodeScanHistory from "../CodeScanHistory";
import { addScanToHistory } from "../CodeScanHistory";

interface ScanHistory {
  code: string;
  timestamp: Date;
  success: boolean;
  rewardName?: string;
}

export default function CodeScanner() {
  const router = useRouter();
  const { addReward, setCooldown, checkCooldown } = useRewards();

  const [code, setCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    reward?: Reward;
  } | null>(null);

  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cooldownStatus = checkCooldown(ActionType.CODE_SCAN);
  const snackProducts = getAvailableSnackProducts();

  // Update cooldown timer
  useEffect(() => {
    if (cooldownStatus.isActive) {
      setCooldownTimer(cooldownStatus.timeRemaining);
      const interval = setInterval(() => {
        const newStatus = checkCooldown(ActionType.CODE_SCAN);
        if (newStatus.isActive) {
          setCooldownTimer(newStatus.timeRemaining);
        } else {
          setCooldownTimer(0);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCooldownTimer(0);
    }
  }, [cooldownStatus.isActive]);

  // Load scan history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("scan-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScanHistory(
          parsed.map((item: ScanHistory) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } catch {
        // Ignore invalid data
      }
    }
  }, []);

  // Save scan history to localStorage
  const saveScanHistory = (newEntry: {
    code: string;
    timestamp: Date;
    success: boolean;
    rewardName?: string;
  }) => {
    // Add to the new history system only
    addScanToHistory({
      code: newEntry.code,
      timestamp: newEntry.timestamp,
      success: newEntry.success,
      rewardName: newEntry.rewardName,
      productName: newEntry.rewardName?.split(" ")[0], // Extract product name from reward
    });
  };

  const handleValidateCode = async () => {
    if (!code.trim()) {
      setResult({
        success: false,
        message: "Please enter a snack product code to scan",
      });
      return;
    }

    if (cooldownStatus.isActive) {
      setResult({
        success: false,
        message: cooldownStatus.message,
      });
      return;
    }

    setIsScanning(true);
    setResult(null);

    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const upperCode = code.trim().toUpperCase();

      if (!isCodeValid(upperCode)) {
        const scanEntry: ScanHistory = {
          code: upperCode,
          timestamp: new Date(),
          success: false,
        };
        saveScanHistory(scanEntry);

        // Play error sound
        playActionSound(ActionType.CODE_SCAN, false).catch(() => {});

        // Show enhanced error toast
        toast.error("❌ Invalid Code", {
          description: (
            <div className="mt-1">
              <div className="font-medium">Code not recognized</div>
              <div className="text-xs opacity-80">
                Please check the code from your snack package and try again
              </div>
            </div>
          ),
          duration: 4000,
        });

        setResult({
          success: false,
          message: "Invalid or expired snack code. Please check and try again.",
        });
        setIsScanning(false);
        return;
      }

      const codeData = getCodeData(upperCode);
      if (!codeData) {
        setResult({
          success: false,
          message: "Snack code not found in database",
        });
        setIsScanning(false);
        return;
      }

      // Check if user already scanned this code recently
      const recentScan = scanHistory.find(
        (scan) =>
          scan.code === upperCode &&
          scan.success &&
          Date.now() - scan.timestamp.getTime() < 24 * 60 * 60 * 1000 // 24 hours
      );

      if (recentScan && codeData.maxUses === 1) {
        // Show warning toast
        toast.warning("Snack code already used", {
          description: "You have already used this snack code recently",
          duration: 4000,
        });

        setResult({
          success: false,
          message: "You have already used this snack code recently",
        });
        setIsScanning(false);
        return;
      }

      // Add reward
      const addResult = addReward({
        ...codeData.reward,
        metadata: {
          code: upperCode,
          location: codeData.location,
          event: codeData.event,
        },
      });

      if (addResult.success) {
        // Set cooldown
        setCooldown(ActionType.CODE_SCAN);

        // Play success sound
        playActionSound(ActionType.CODE_SCAN, true).catch(() => {});

        // Show enhanced success toast with reward details
        toast.success("🎉 Reward Earned!", {
          description: (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">{codeData.reward.icon}</span>
              <div>
                <div className="font-semibold">{codeData.reward.name}</div>
                <div className="text-xs opacity-80">
                  {codeData.reward.description}
                </div>
              </div>
            </div>
          ),
          duration: 5000,
        });

        // Save to history
        const scanEntry: ScanHistory = {
          code: upperCode,
          timestamp: new Date(),
          success: true,
          rewardName: codeData.reward.name,
        };
        saveScanHistory(scanEntry);

        setResult({
          success: true,
          message: `Congratulations! You earned: ${codeData.reward.name}`,
          reward: addResult.reward,
        });

        // Clear code input
        setCode("");
      } else {
        setResult({
          success: false,
          message: addResult.message || "Failed to add reward",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "An error occurred while processing the snack code",
      });
    }

    setIsScanning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isScanning && !cooldownStatus.isActive) {
      handleValidateCode();
    }
  };

  // Filter products based on search and brand selection
  const filteredProducts = snackProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrand === "all" || product.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Get unique brands for filter
  const brands = Array.from(new Set(snackProducts.map((p) => p.brand)));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!", {
      description: "You can now paste it in the scanner",
      duration: 2000,
    });
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <div className="space-y-6 ">
        {/* Scanner Interface */}
        <Card className="border shadow-2xl">
          <CardContent className="space-y-6 max-w-xl lg:max-w-3xl mx-auto">
            <div className="text-center">
              <p className="">
                Enter code from your products to collect rewards
              </p>
            </div>

            {/* Code Input */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter snack product code here..."
                  disabled={isScanning || cooldownStatus.isActive}
                  className="text-center text-lg font-mono transition-all duration-200"
                  maxLength={30}
                />
                {code && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCode("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Scan Button */}
              <Button
                onClick={handleValidateCode}
                disabled={isScanning || cooldownStatus.isActive || !code.trim()}
                className="w-full font-semibold py-3"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Scan className="w-5 h-5 mr-2" />
                    </motion.div>
                    Scanning...
                  </>
                ) : cooldownStatus.isActive ? (
                  <>
                    <Clock className="w-5 h-5 mr-2" />
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-2" />
                    Validate Code
                  </>
                )}
              </Button>
            </div>

            {/* Cooldown Info */}
            {cooldownStatus.isActive && (
              <div className="p-4 rounded-xl border">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    Please wait{" "}
                    <span className="font-semibold">
                      {formatCooldownTime(cooldownTimer)}
                    </span>{" "}
                    before scanning another snack code
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products and History Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div className="lg:col-span-3">
            {/* Available Snack Products */}
            <Card className="border shadow-2xl">
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={selectedBrand}
                    onValueChange={setSelectedBrand}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.code}
                     
                      className="group cursor-pointer"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-100 overflow-hidden flex flex-col">
                        <CardContent className="p-2 md:p-5 relative z-10 flex flex-col flex-1">
                          {/* Product Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="text-3xl md:text-4xl filter drop-shadow-lg flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-contain rounded-xl"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm md:text-base mb-1 leading-tight break-words overflow-hidden">
                                {product.name}
                              </h3>
                              <p className="text-xs md:text-sm text-muted-foreground font-medium truncate">
                                {product.brand}
                              </p>
                            </div>
                            <CustomBadge type={product.rarity} />
                          </div>

                          {/* Product Details */}
                          <div className="space-y-3 flex-1 flex flex-col">
                            {/* Copy Code Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(`${product.code}-DEMO`);
                              }}
                              className="text-xs font-mono group/btn flex-shrink-0"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline truncate">
                                {product.code}-DEMO
                              </span>
                              <span className="sm:hidden truncate">
                                {product.code.split("-")[0]}
                              </span>
                            </Button>

                            {/* View Details Button */}
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/product/${product.id}`);
                              }}
                              className="text-xs"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      No snack products found
                    </p>
                    <p className="text-sm mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Scan History Sidebar */}
          <div className="lg:col-span-1">
            <CodeScanHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
