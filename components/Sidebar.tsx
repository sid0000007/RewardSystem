"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  QrCode,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  User,
  Gift,
  LucideIcon,
} from "lucide-react";
import { playUISound } from "@/lib/sounds";
import { useSidebar } from "./AppLayout";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: HomeIcon,
    href: "/dashboard",
    description: "Overview & Stats",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: Wallet,
    href: "/wallet",
    description: "Your Rewards",
  },
  {
    id: "productCode",
    label: "Product Codes",
    icon: QrCode,
    href: "/product",
    description: "Scan QR Codes",
  },
  {
    id: "watch",
    label: "Watch",
    icon: Video,
    href: "/watch",
    description: "Watch Videos",
  },
  {
    id: "checkin",
    label: "Check-in",
    icon: MapPin,
    href: "/checkin",
    description: "Location Check-in",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
    description: "User Settings",
  },
];

export default function Sidebar() {
  const { sidebarExpanded, setSidebarExpanded } = useSidebar();
  const pathname = usePathname();

  const handleTabClick = () => {
    playUISound("tab-switch").catch(() => {});
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarExpanded ? "280px" : "80px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-50 h-screen bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border shadow-2xl flex flex-col"
    >
      {/* Sidebar Toggle Button - Positioned over border */}
      <button
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className="absolute -right-4 top-8 z-20 w-8 h-8 bg-background/90 backdrop-blur-xl border border-sidebar-border rounded-lg flex items-center justify-center text-sidebar-foreground transition-colors shadow-lg"
      >
        {sidebarExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className=" gap-3 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 " />
          </div>
          {sidebarExpanded && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-sidebar-foreground"
            ></motion.h1>
          )}
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/") ||
            (item.href === "/product" && pathname.startsWith("/product/")) ||
            (item.href === "/watch" && pathname.startsWith("/watch/"));

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                onClick={handleTabClick}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500  shadow-lg"
                    : "text-sidebar-foreground "
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarExpanded && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
