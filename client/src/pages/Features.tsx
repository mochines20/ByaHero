import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

type Feature = {
  id: string;
  title: string;
  priority: "MVP" | "V2" | "V3";
  description: string;
  actionLabel: string;
  to?: string;
};

const features: Feature[] = [
  {
    id: "01",
    title: "AI commute assistant (chatbot)",
    priority: "MVP",
    description: "Ask in Filipino or English and get best route, travel time, and fare instantly without manual searching.",
    actionLabel: "Open AI Chat",
    to: "/chat",
  },
  {
    id: "02",
    title: "Predictive commute time",
    priority: "V2",
    description: "Suggests exact departure time using traffic history, weather, and local events.",
    actionLabel: "Open Predictive Time",
    to: "/predictive-time",
  },
  {
    id: "03",
    title: "Smart commute schedule",
    priority: "V2",
    description: "Learns recurring commute patterns and auto-builds a personalized weekly schedule.",
    actionLabel: "Set Schedule",
    to: "/schedule",
  },
  {
    id: "04",
    title: "Crowd level predictor",
    priority: "V2",
    description: "Forecasts jeep, MRT, and bus crowd levels with peak-hour heatmaps.",
    actionLabel: "Check Crowd",
    to: "/crowd",
  },
  {
    id: "05",
    title: "SOS panic button",
    priority: "MVP",
    description: "Hold for 3 seconds to send live location and details to emergency contacts.",
    actionLabel: "Open SOS",
    to: "/emergency-contacts",
  },
  {
    id: "06",
    title: "Live location sharing",
    priority: "MVP",
    description: "Share real-time location with family or friends while commuting, then auto-stop on arrival.",
    actionLabel: "Start Sharing",
    to: "/emergency-contacts",
  },
  {
    id: "07",
    title: "Monthly commute recap",
    priority: "V2",
    description: "Shareable monthly summary of commute time, spending, and trip highlights.",
    actionLabel: "View Recap",
    to: "/recap",
  },
  {
    id: "08",
    title: "Offline-first mode",
    priority: "MVP",
    description: "Core features work without internet and sync when the connection returns.",
    actionLabel: "Offline Status",
    to: "/offline",
  },
  {
    id: "09",
    title: "Commute buddy matching",
    priority: "V2",
    description: "Matches commuters with similar routes and schedules, with verified profiles and chat.",
    actionLabel: "Coming Soon",
    to: "/buddy-matching",
  },
  {
    id: "10",
    title: "Harassment & incident reporting",
    priority: "V2",
    description: "Report incidents with details and evidence and track status.",
    actionLabel: "Report Incident",
    to: "/incident-report",
  },
  {
    id: "11",
    title: "Office / school group commute",
    priority: "V2",
    description: "Private groups for shared commute stats, reimbursements, and carpool coordination.",
    actionLabel: "Coming Soon",
    to: "/group-commute",
  },
  {
    id: "12",
    title: "PWD accessibility mode",
    priority: "V2",
    description: "Wheelchair-friendly filters, large text, and high contrast options.",
    actionLabel: "Accessibility Settings",
    to: "/settings",
  },
  {
    id: "13",
    title: "Multi-language support",
    priority: "V3",
    description: "Filipino, Bisaya, Ilocano, and English toggle for nationwide use.",
    actionLabel: "Language Settings",
    to: "/settings",
  },
];

export function FeaturesPage() {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">ByaHero Features</h1>
        <p className="mt-1 text-sm text-byahero-muted">Each roadmap item has its own handler and place in the system.</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <Card key={f.id} className="rounded-3xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-byahero-blue">#{f.id}</p>
              <span className="rounded-full bg-byahero-light px-2 py-1 text-xs font-semibold text-byahero-navy">{f.priority}</span>
            </div>
            <h3 className="mt-2 font-semibold text-byahero-navy">{f.title}</h3>
            <p className="mt-1 text-sm text-byahero-muted">{f.description}</p>
            <div className="mt-3">
              <Link to={f.to ?? "/features"} className="inline-flex min-h-10 items-center rounded-full bg-[#33b6ff] px-3 text-xs font-semibold text-white">
                {f.actionLabel}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

