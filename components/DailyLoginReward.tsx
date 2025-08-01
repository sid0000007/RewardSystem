"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, Sparkles, Gift, Calendar } from "lucide-react";
import { Reward, RewardType, ActionType } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import RewardAnimation from "./RewardAnimation";

export default function DailyLoginReward() {
  const { checkDailyLogin, addReward } = useRewards();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [dailyReward, setDailyReward] = useState<Reward | null>(null);

  useEffect(() => {
    // Check for daily login on component mount
    const { isNewDay } = checkDailyLogin();

    if (isNewDay) {
      // Show welcome animation first
      setShowWelcome(true);

      // After welcome animation, show reward
      setTimeout(() => {
        setShowWelcome(false);

        // Create daily reward
        const reward: Reward = {
          id: `daily-login-${Date.now()}`,
          name: "Daily Login Bonus",
          type: RewardType.COMMON,
          icon: "🌅",
          description: "Welcome back! Here's your daily reward for visiting.",
          actionType: ActionType.DAILY_LOGIN,
          earnedAt: new Date(),
          metadata: {
            dailyLogin: true,
            loginDate: new Date().toISOString(),
          },
        };

        setDailyReward(reward);
        setShowReward(true);

        // Add reward to user's wallet
        addReward({
          name: reward.name,
          type: reward.type,
          icon: reward.icon,
          description: reward.description,
          actionType: reward.actionType,
          metadata: reward.metadata,
        });
      }, 3000); // Show welcome for 3 seconds
    }
  }, [checkDailyLogin, addReward]);

  return (
    <AnimatePresence>
      {/* Welcome Back Animation */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 border shadow-2xl text-center"
          >
            {/* Sun Icon Animation */}
            <motion.div
              initial={{ rotate: -45, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sun className="w-10 h-10 text-white" />
            </motion.div>

            {/* Welcome Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Welcome Back!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              Great to see you again! Here's your daily reward for visiting.
            </motion.p>

            {/* Sparkles Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Gift className="w-6 h-6 text-orange-500" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Calendar className="w-6 h-6 text-blue-500" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Daily Reward Animation */}
      {showReward && dailyReward && (
        <RewardAnimation
          reward={dailyReward}
          onComplete={() => {
            setShowReward(false);
            setDailyReward(null);
          }}
        />
      )}
    </AnimatePresence>
  );
}
