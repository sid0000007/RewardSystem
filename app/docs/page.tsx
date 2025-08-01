"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  MapPin,
  Video,
  Wallet,
  Settings,
  Wrench,
  BookOpen,
  ArrowRight,
  FileText,
  HelpCircle,
} from "lucide-react";

const documentationSections = [
  {
    title: "Core Features",
    items: [
      {
        title: "Code Scanner",
        description: "QR code scanning and product rewards",
        icon: QrCode,
        href: "/docs/code-scanner",
        color: "from-sky-500 to-sky-600",
      },
      {
        title: "Location Check-in",
        description: "Geolocation-based rewards",
        icon: MapPin,
        href: "/docs/location-checkin",
        color: "from-emerald-500 to-emerald-600",
      },
      {
        title: "Video Watcher",
        description: "Video watching rewards",
        icon: Video,
        href: "/docs/video-watcher",
        color: "from-purple-500 to-purple-600",
      },
      {
        title: "Wallet System",
        description: "Reward management and storage",
        icon: Wallet,
        href: "/docs/wallet-system",
        color: "from-amber-500 to-amber-600",
      },
    ],
  },  
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FileText className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            RealMint Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive guides and tutorials for all RealMint features. Find
            step-by-step instructions, troubleshooting tips, and technical
            details.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-12">
          {documentationSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: sectionIndex * 0.1 + itemIndex * 0.05,
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link href={item.href}>
                      <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}
                            >
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">
                            {item.title}
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {item.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>       
      </div>
    </div>
  );
}
