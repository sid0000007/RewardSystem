"use client";

import { useEffect } from "react";
import { useRewards } from "@/hooks/useRewards";

export default function StoreInitializer() {
  const { initializeStore } = useRewards();

  useEffect(() => {
    // Initialize the store when the component mounts
    initializeStore();
  }, [initializeStore]);

  return null; // This component doesn't render anything
}
