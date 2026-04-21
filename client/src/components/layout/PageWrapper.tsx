import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { SOSButton } from "../ui/SOSButton";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

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
    <div className="min-h-screen lg:flex lg:gap-3 lg:p-3">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <Header title={title} />
        <main className="page-enter flex-1 p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
      <BottomNav />
      <SOSButton />
    </div>
  );
}
