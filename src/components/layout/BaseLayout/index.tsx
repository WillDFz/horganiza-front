'use client';
import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import RouteGuard from '@/utils/RouteGuard/Business';
import { useMediaQuery } from '@mui/material';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sidebarIsOpen = isDesktop ? true : isSidebarOpen;

  return (
    <RouteGuard>
      <div>
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={sidebarIsOpen} onClose={closeSidebar} />
        <main
          className={`px-4 py-8 transition-all duration-300 ${isDesktop ? 'lg:ml-64' : ''}`}
        >
          {children}
        </main>
      </div>
    </RouteGuard>
  );
};

export default BaseLayout;
