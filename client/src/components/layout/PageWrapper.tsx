import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { SOSAlertButton } from "../ui/SOSAlertButton";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MagByaheFAB } from "../ui/MagByaheFAB";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/features": "Features",
  "/expenses": "Expenses",
  "/planner": "Route Planner",
  "/predictive-time": "Predictive Commute Time",
  "/schedule": "Smart Commute Schedule",
  "/crowd": "Crowd Level Predictor",
  "/emergency-contacts": "Emergency Contacts",
  "/incident-report": "Incident Reporting",
  "/recap": "Monthly Recap",
  "/offline": "Offline-first Status",
  "/buddy-matching": "Commute Buddy Matching",
  "/group-commute": "Group Commute",
  "/calculator": "WFH Calculator",
  "/receipts": "Receipts",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function PageWrapper({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const title = titleMap[pathname] ?? "ByaHero";

  return (
    <div className="min-h-screen bg-transparent lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-24 md:pb-0">
        <Header title={title} />
        <main className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="min-h-full"
          >
              <ErrorBoundary resetKey={pathname} compact>
                {children}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
      <MagByaheFAB />
      <SOSAlertButton />
    </div>
  );
}

