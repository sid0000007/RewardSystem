"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Scan, Calendar, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScanHistoryEntry {
  code: string;
  timestamp: Date;
  success: boolean;
  rewardName?: string;
  productName?: string;
}

export default function CodeScanHistory() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("scan-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const historyWithDates = parsed.map((entry: ScanHistoryEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error("Failed to parse scan history:", error);
      }
    }
  }, []);

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

  const getStats = () => {
    const totalScans = history.length;
    const successfulScans = history.filter((entry) => entry.success).length;
    const uniqueProducts = new Set(
      history
        .filter((entry) => entry.success && entry.productName)
        .map((entry) => entry.productName)
    ).size;

    return {
      totalScans,
      successfulScans,
      uniqueProducts,
    };
  };

  

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
            <p className="text-muted-foreground text-sm">
              Start scanning codes to see your history here
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              Your scan history will appear here once you scan codes
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = getStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Scan History
          </CardTitle>          
        </div>
        <div className="flex flex-col gap-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>{stats.totalScans} scans</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{stats.successfulScans} successful</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{stats.uniqueProducts} products</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
          {history.map((entry, index) => (
            <motion.div
              key={`${entry.code}-${entry.timestamp.getTime()}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-3 p-4 bg-muted/50 rounded-lg border hover:bg-muted transition-all duration-200"
            >
              

              {/* Scan Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate text-sm font-mono">
                  {entry.code}
                </h4>
                <div className="flex flex-col item-start text-xs text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>                 
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Export the function to add to history (can be called from CodeScanner)
export const addScanToHistory = (entry: ScanHistoryEntry) => {
  const savedHistory = localStorage.getItem("scan-history");
  let history: ScanHistoryEntry[] = [];

  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      history = parsed.map((item: ScanHistoryEntry) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error("Failed to parse scan history:", error);
    }
  }

  const newHistory = [entry, ...history].slice(0, 50); // Keep last 50 entries
  localStorage.setItem("scan-history", JSON.stringify(newHistory));
};
