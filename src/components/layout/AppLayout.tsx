import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { SetupBanner } from '@/components/common/SetupBanner'
import { NotificationDrawer } from '@/components/reminders/NotificationDrawer'

export function AppLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Supabase Setup guidance banner */}
      <SetupBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-8">
          <Header onOpenNotifications={() => setNotificationsOpen(true)} />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Slide-over Notifications / Reminders Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  )
}
