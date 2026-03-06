'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardShellProps {
  user: { $id: string; email: string } | null;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar (Fixed or off-canvas) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay when mobile sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'hidden lg:flex' : ''}`}>
        {/* TopBar (Sticky) with hamburger on mobile */}
        <TopBar user={user} onHamburger={() => setSidebarOpen(true)} />

        {/* Workspace Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
