"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift, Star } from "lucide-react";
import { Reward, RewardType } from "@/types";
import { getRewardRarity } from "@/lib/utils";

interface RewardAnimationProps {
  reward: Reward;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

export default function RewardAnimation({
  reward,
  onComplete,
}: RewardAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showReward, setShowReward] = useState(false);

  const rarity = getRewardRarity(reward.type);

  // Memoize the onComplete callback to prevent infinite re-renders
  const memoizedOnComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  // Generate particles based on reward rarity
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const particleCount =
      {
        [RewardType.COMMON]: 20,
        [RewardType.RARE]: 35,
        [RewardType.EPIC]: 50,
        [RewardType.LEGENDARY]: 75,
        [RewardType.SPECIAL]: 60,
      }[reward.type] || 20;

    const colors = {
      [RewardType.COMMON]: ["#6B7280", "#9CA3AF", "#D1D5DB"],
      [RewardType.RARE]: ["#3B82F6", "#60A5FA", "#93C5FD"],
      [RewardType.EPIC]: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
      [RewardType.LEGENDARY]: ["#F59E0B", "#FBBF24", "#FCD34D"],
      [RewardType.SPECIAL]: ["#EC4899", "#F472B6", "#F9A8D4"],
    }[reward.type] || ["#6B7280", "#9CA3AF", "#D1D5DB"];

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: -(Math.random() * 8 + 4),
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setParticles(newParticles);

    // Show reward after brief delay
    const showTimeout = setTimeout(() => setShowReward(true), 300);

    // Complete animation
    const completeTimeout = setTimeout(() => {
      memoizedOnComplete();
    }, 3000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(completeTimeout);
    };
  }, [reward.type, reward.id, memoizedOnComplete]); // Use memoized callback

  // Animate particles
  useEffect(() => {
    // Only run on client side and when particles exist
    if (typeof window === "undefined" || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length === 0) return prev;

        return prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            rotation: particle.rotation + particle.rotationSpeed,
            velocity: {
              ...particle.velocity,
              y: particle.velocity.y + 0.2, // gravity
            },
          }))
          .filter(
            (particle) =>
              particle.y < window.innerHeight + 50 &&
              particle.x > -50 &&
              particle.x < window.innerWidth + 50
          );
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [particles.length]); // Only depend on particles.length, not the array itself

  const getRarityGradient = (type: RewardType) => {
    switch (type) {
      case RewardType.LEGENDARY:
        return "from-yellow-400 via-yellow-500 to-orange-500";
      case RewardType.EPIC:
        return "from-purple-400 via-purple-500 to-pink-500";
      case RewardType.RARE:
        return "from-blue-400 via-blue-500 to-cyan-500";
      case RewardType.SPECIAL:
        return "from-pink-400 via-pink-500 to-rose-500";
      default:
        return "from-gray-400 via-gray-500 to-gray-600";
    }
  };

  const getRarityIcon = (type: RewardType) => {
    switch (type) {
      case RewardType.LEGENDARY:
        return <Star className="w-8 h-8 text-yellow-500" />;
      case RewardType.EPIC:
        return <Sparkles className="w-8 h-8 text-purple-500" />;
      case RewardType.RARE:
        return <Gift className="w-8 h-8 text-blue-500" />;
      case RewardType.SPECIAL:
        return <Sparkles className="w-8 h-8 text-pink-500" />;
      default:
        return <Gift className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [1, 1.2, 0],
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}

      {/* Confetti shapes for legendary rewards */}
      {reward.type === RewardType.LEGENDARY && (
        <>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute"
              initial={{
                x: window.innerWidth / 2,
                y: -50,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 800,
                y: window.innerHeight + 50,
                rotate: Math.random() * 720,
                scale: [1, 1.5, 0.5],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            >
              <div
                className={`w-3 h-6 ${
                  i % 3 === 0
                    ? "bg-yellow-400"
                    : i % 3 === 1
                    ? "bg-orange-400"
                    : "bg-red-400"
                } rounded-sm`}
              />
            </motion.div>
          ))}
        </>
      )}

      {/* Reward Display */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -50 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              {/* Glow Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${getRarityGradient(
                  reward.type
                )} blur-xl`}
              />

              {/* Reward Card */}
              <div className="relative rounded-2xl p-8 shadow-2xl border-4  min-w-[300px]">
                {/* Rarity Icon */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className=" rounded-full p-2 shadow-lg"
                  >
                    {getRarityIcon(reward.type)}
                  </motion.div>
                </div>

                <div className="text-center mt-4">
                  {/* Reward Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-6xl mb-4"
                  >
                    {reward.icon}
                  </motion.div>

                  {/* Reward Info */}
                  <h3 className="text-2xl font-bold  mb-2">{reward.name}</h3>

                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${rarity.color} bg-opacity-20 mb-3`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        reward.type === "legendary"
                          ? "bg-yellow-500"
                          : reward.type === "epic"
                          ? "bg-purple-500"
                          : reward.type === "rare"
                          ? "bg-blue-500"
                          : reward.type === "special"
                          ? "bg-pink-500"
                          : "bg-gray-500"
                      }`}
                    />
                    {rarity.label}
                  </div>

                  <p className=" text-sm max-w-xs">{reward.description}</p>

                  {/* Success Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-green-600 dark:text-green-400 font-semibold"
                  >
                    ✨ Reward Unlocked! ✨
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle Effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          initial={{
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 1.5,
            repeat: 2,
            ease: "easeInOut",
          }}
        >
          <Sparkles
            className={`w-6 h-6 ${
              reward.type === "legendary"
                ? "text-yellow-500"
                : reward.type === "epic"
                ? "text-purple-500"
                : reward.type === "rare"
                ? "text-blue-500"
                : reward.type === "special"
                ? "text-pink-500"
                : "text-gray-500"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}
