"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarRefreshContextType {
  refreshKey: number;
  refreshSidebar: () => void;
}

const SidebarRefreshContext = createContext<SidebarRefreshContextType | undefined>(undefined);

export const SidebarRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshSidebar = () => setRefreshKey((prev) => prev + 1);
  return (
    <SidebarRefreshContext.Provider value={{ refreshKey, refreshSidebar }}>
      {children}
    </SidebarRefreshContext.Provider>
  );
};

export const useSidebarRefresh = () => {
  const context = useContext(SidebarRefreshContext);
  if (!context) throw new Error("useSidebarRefresh must be used within a SidebarRefreshProvider");
  return context;
}; 