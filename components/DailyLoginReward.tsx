"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, Sparkles, Gift, Calendar } from "lucide-react";
import { Reward, RewardType, ActionType } from "@/types";
import { useRewards } from "@/hooks/useRewards";
import RewardAnimation from "./RewardAnimation";
import { toast } from "sonner";

export default function DailyLoginReward() {
  const { checkDailyLogin, addReward } = useRewards();
  const [showWelcome, setShowWelcome] = useState(false); 

  useEffect(() => {
    const { isNewDay } = checkDailyLogin();

    if (isNewDay) {
      setShowWelcome(true);

      setTimeout(async () => {
        setShowWelcome(false);

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
       

        addReward({
          name: reward.name,
          type: reward.type,
          icon: reward.icon,
          description: reward.description,
          actionType: reward.actionType,
          metadata: reward.metadata,
        });
      }, 3000);

      toast.success("Welcome Back!", {
        description: "Here's your daily reward for visiting.",
        duration: 3000,
      });     
    }
  }, [checkDailyLogin, addReward]);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 border shadow-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sun className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold mb-2"
            >
              Welcome!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-6"
            >
              Great to see you Here&apos;s your daily reward for
              visiting.
            </motion.p>

            <div className="flex justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <Gift className="w-6 h-6 text-orange-500" />
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </motion.div>
        </motion.div>
      )}

      
    </AnimatePresence>
  );
}
