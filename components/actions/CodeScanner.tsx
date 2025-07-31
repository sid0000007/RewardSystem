"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Scan,
  Check,
  X,
  Clock,
  AlertCircle,
  Gift,
  History,
} from "lucide-react";
import { useRewards } from "@/hooks/useRewards";
import { ActionType, Reward } from "@/types";
import { getCodeData, isCodeValid } from "@/data/codes";
import { formatCooldownTime } from "@/lib/utils";
import { playActionSound } from "@/lib/sounds";
import RewardAnimation from "../RewardAnimation";
import { toast } from "sonner";

interface ScanHistory {
  code: string;
  timestamp: Date;
  success: boolean;
  rewardName?: string;
}

export default function CodeScanner() {
  const { addReward, setCooldown, checkCooldown } = useRewards();

  const [code, setCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    reward?: Reward;
  } | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const cooldownStatus = checkCooldown(ActionType.CODE_SCAN);

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
  }, [cooldownStatus.isActive]); // Remove dependencies that cause infinite re-renders

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
  const saveScanHistory = (newEntry: ScanHistory) => {
    const updated = [newEntry, ...scanHistory].slice(0, 10); // Keep last 10
    setScanHistory(updated);
    localStorage.setItem("scan-history", JSON.stringify(updated));
  };

  const handleScan = async () => {
    if (!code.trim()) {
      setResult({
        success: false,
        message: "Please enter a code to scan",
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

        // Show error toast
        toast.error("Invalid code", {
          description: "Please check the code and try again",
          duration: 4000,
        });

        setResult({
          success: false,
          message: "Invalid or expired code. Please check and try again.",
        });
        setIsScanning(false);
        return;
      }

      const codeData = getCodeData(upperCode);
      if (!codeData) {
        setResult({
          success: false,
          message: "Code not found in database",
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
        toast.warning("Code already used", {
          description: "You have already used this code recently",
          duration: 4000,
        });

        setResult({
          success: false,
          message: "You have already used this code recently",
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

        // Show success toast
        toast.success("Code scanned successfully!", {
          description: `You earned: ${codeData.reward.name}`,
          duration: 4000,
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

        // Show animation after toast
        setTimeout(() => {
          setShowAnimation(true);
          setTimeout(() => setShowAnimation(false), 3000);
        }, 1000);

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
        message: "An error occurred while processing the code",
      });
    }

    setIsScanning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isScanning && !cooldownStatus.isActive) {
      handleScan();
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Scanner Interface */}
      <div className=" rounded-xl p-6 border  shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 " />
          </div>
          <h2 className="text-2xl font-bold 2">Code Scanner</h2>
          <p className="">Enter a valid code to unlock rewards</p>
        </div>

        {/* Code Input */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter code here..."
              disabled={isScanning || cooldownStatus.isActive}
              className="w-full px-4 py-3 text-center text-lg font-mono border  rounded-lg   focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={20}
            />
            {code && (
              <button
                onClick={() => setCode("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 "
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Scan Button */}
          <motion.button
            whileHover={{ scale: cooldownStatus.isActive ? 1 : 1.02 }}
            whileTap={{ scale: cooldownStatus.isActive ? 1 : 0.98 }}
            onClick={handleScan}
            disabled={isScanning || cooldownStatus.isActive || !code.trim()}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isScanning || cooldownStatus.isActive || !code.trim()
                ? "cursor-not-allowed"
                : " shadow-lg hover:shadow-xl"
            }`}
          >
            {isScanning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Scan className="w-5 h-5" />
                </motion.div>
                Scanning...
              </>
            ) : cooldownStatus.isActive ? (
              <>
                <Clock className="w-5 h-5" />
                Cooldown: {formatCooldownTime(cooldownTimer)}
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" />
                Scan Code
              </>
            )}
          </motion.button>
        </div>

        {/* Cooldown Info */}
        {cooldownStatus.isActive && (
          <div className="mt-4 p-3  rounded-lg">
            <div className="flex items-center gap-2 ">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Please wait {formatCooldownTime(cooldownTimer)} before scanning
                another code
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg- green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1 rounded-full ${
                  result.success ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {result.success ? (
                  <Check className="w-4 h-4 " />
                ) : (
                  <AlertCircle className="w-4 h-4 " />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    result.success
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {result.message}
                </p>
              </div>
              <button
                onClick={clearResult}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className=" rounded-xl p-6 border  shadow-lg">
          <h3 className="text-lg font-semibold  mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Scans
          </h3>
          <div className="space-y-2">
            {scanHistory.slice(0, 5).map((scan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3  rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      scan.success ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <div className="font-mono text-sm font-medium ">
                      {scan.code}
                    </div>
                    {scan.rewardName && (
                      <div className="text-xs ">{scan.rewardName}</div>
                    )}
                  </div>
                </div>
                <div className="text-xs ">
                  {scan.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Test Codes */}
      <div className=" rounded-xl p-6 border ">
        <h3 className="text-lg font-semibold  mb-3 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Test Codes
        </h3>
        <p className=" text-sm mb-4">
          Try these demo codes to test the scanner:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["TEST123", "DEMO456", "WELCOME2024", "COFFEE123"].map(
            (testCode) => (
              <button
                key={testCode}
                onClick={() => setCode(testCode)}
                className="p-2 bg-blue-800  dark:text-blue-200 hover:bg-blue-900 rounded-lg text-sm font-mono  transition-colors"
              >
                {testCode}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showAnimation && result?.reward && (
          <RewardAnimation
            reward={result.reward!}
            onComplete={() => setShowAnimation(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
