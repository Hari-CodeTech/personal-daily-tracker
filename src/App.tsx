import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { TrackerProvider } from '@/context/TrackerContext'
import { AppLayout } from '@/components/layout/AppLayout'

// Pages
import { DashboardPage } from '@/pages/DashboardPage'
import { HabitsPage } from '@/pages/HabitsPage'
import { StudyPlannerPage } from '@/pages/StudyPlannerPage'
import { JobApplicationsPage } from '@/pages/JobApplicationsPage'
import { HealthPage } from '@/pages/HealthPage'
import { DailyReflectionPage } from '@/pages/DailyReflectionPage'
import { ChallengePage } from '@/pages/ChallengePage'
import { CalendarPage } from '@/pages/CalendarPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SetupInstructionsPage } from '@/pages/SetupInstructionsPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { LoadingState } from '@/components/common/LoadingState'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured, isDemoMode } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950">
        <LoadingState message="Verifying authentication session..." />
      </div>
    )
  }

  // If Supabase is configured and not logged in, redirect to login
  if (isConfigured && !user) {
    return <Navigate to="/login" replace />
  }

  // If Supabase is not configured and not in local demo mode, show setup page
  if (!isConfigured && !isDemoMode && !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TrackerProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/setup" element={<SetupInstructionsPage />} />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="habits" element={<HabitsPage />} />
                <Route path="study" element={<StudyPlannerPage />} />
                <Route path="jobs" element={<JobApplicationsPage />} />
                <Route path="health" element={<HealthPage />} />
                <Route path="reflection" element={<DailyReflectionPage />} />
                <Route path="challenge" element={<ChallengePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TrackerProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
