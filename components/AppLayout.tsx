"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";

interface SidebarContextType {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within AppLayout");
  }
  return context;
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Start expanded by default

  useEffect(() => {
    // Auto-collapse sidebar on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      } else {
        // Keep expanded on desktop
        setSidebarExpanded(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ sidebarExpanded, setSidebarExpanded }}>
      <div className="min-h-screen bg-background">
        <Sidebar />

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col min-h-screen bg-background"
          style={{
            marginLeft: sidebarExpanded ? "280px" : "80px",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {/* Content Area */}
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
