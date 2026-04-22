import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageWrapper } from "./components/layout/PageWrapper";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { OfflineBanner } from "./components/ui/OfflineBanner";
import { RouteAnnouncer } from "./components/ui/RouteAnnouncer";
import { SkeletonPage } from "./components/ui/Skeleton";
import { ToastHost } from "./components/ui/Toast";
import { AnalyticsPage } from "./pages/Analytics";
import { CalculatorPage } from "./pages/Calculator";
import { ChatPage } from "./pages/Chat";
import { DashboardPage } from "./pages/Dashboard";
import { EmergencyContactsPage } from "./pages/EmergencyContacts";
import { ExpensesPage } from "./pages/Expenses";
import { FeaturesPage } from "./pages/Features";
import { ForgotPasswordPage } from "./pages/ForgotPassword";
import { IncidentReportPage } from "./pages/IncidentReport";
import { LoginPage } from "./pages/Login";
import { PlannerPage } from "./pages/Planner";
import { PredictiveTimePage } from "./pages/PredictiveTime";
import { ReceiptsPage } from "./pages/Receipts";
import { RegisterPage } from "./pages/Register";
import { RecapPage } from "./pages/Recap";
import { ResetPasswordPage } from "./pages/ResetPassword";
import { SchedulePage } from "./pages/Schedule";
import { CrowdPage } from "./pages/Crowd";
import { OfflinePage } from "./pages/Offline";
import { ComingSoonPage } from "./pages/ComingSoon";
import { SettingsPage } from "./pages/Settings";
import { useAuth } from "./hooks/useAuth";
import { useAuthStore } from "./store/authStore";

function ProtectedRoute({ children, loading }: { children: JSX.Element; loading: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (loading) {
    return <SkeletonPage />;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { loading } = useAuth();

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <RouteAnnouncer />
      <ToastHost />
      <Suspense fallback={<SkeletonPage />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute loading={loading}>
                <PageWrapper>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="features" element={<FeaturesPage />} />
                    <Route path="expenses" element={<ExpensesPage />} />
                    <Route path="calculator" element={<CalculatorPage />} />
                    <Route path="receipts" element={<ReceiptsPage />} />
                    <Route path="planner" element={<PlannerPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="predictive-time" element={<PredictiveTimePage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="crowd" element={<CrowdPage />} />
                    <Route path="emergency-contacts" element={<EmergencyContactsPage />} />
                    <Route path="incident-report" element={<IncidentReportPage />} />
                    <Route path="recap" element={<RecapPage />} />
                    <Route path="offline" element={<OfflinePage />} />
                    <Route path="buddy-matching" element={<ComingSoonPage title="Commute Buddy Matching" description="Match commuters with similar routes and schedules (V2)." />} />
                    <Route path="group-commute" element={<ComingSoonPage title="Office / School Group Commute" description="Private groups for shared commute stats and reimbursements (V2)." />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </PageWrapper>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
