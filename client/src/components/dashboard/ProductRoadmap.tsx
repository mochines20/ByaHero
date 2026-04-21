import { Link } from "react-router-dom";

type RoadmapItem = {
  id: string;
  title: string;
  category: "AI-powered" | "Safety" | "UX" | "Social" | "Essential";
  priority: "MVP" | "V2" | "V3";
  description: string;
  actionLabel: string;
  actionTo?: string;
};

const priorityClasses: Record<RoadmapItem["priority"], string> = {
  MVP: "bg-emerald-100/80 text-emerald-700 border-emerald-200/80",
  V2: "bg-sky-100/80 text-sky-700 border-sky-200/80",
  V3: "bg-violet-100/80 text-violet-700 border-violet-200/80",
};

const categoryClasses: Record<RoadmapItem["category"], string> = {
  "AI-powered": "bg-indigo-100/70 text-indigo-700",
  Safety: "bg-rose-100/70 text-rose-700",
  UX: "bg-amber-100/80 text-amber-700",
  Social: "bg-cyan-100/80 text-cyan-700",
  Essential: "bg-teal-100/80 text-teal-700",
};

const roadmapItems: RoadmapItem[] = [
  {
    id: "01",
    title: "AI commute assistant (chatbot)",
    category: "AI-powered",
    priority: "MVP",
    description:
      "Ask in Filipino or English and get best route, travel time, and fare instantly without manual searching.",
    actionLabel: "Open AI Chat",
    actionTo: "/chat",
  },
  {
    id: "02",
    title: "Predictive commute time",
    category: "AI-powered",
    priority: "V2",
    description:
      "Suggests exact departure time using traffic history, weather, and local events.",
    actionLabel: "Open Route Planner",
    actionTo: "/planner",
  },
  {
    id: "03",
    title: "Smart commute schedule",
    category: "AI-powered",
    priority: "V2",
    description:
      "Learns recurring commute patterns and auto-builds a personalized weekly schedule.",
    actionLabel: "Set Schedule",
    actionTo: "/planner",
  },
  {
    id: "04",
    title: "Crowd level predictor",
    category: "AI-powered",
    priority: "V2",
    description:
      "Forecasts jeep, MRT, and bus crowd levels with peak-hour heatmaps.",
    actionLabel: "Check Crowd",
    actionTo: "/planner",
  },
  {
    id: "05",
    title: "SOS panic button",
    category: "Safety",
    priority: "MVP",
    description:
      "Hold for 3 seconds to send live location, route, and transport details to emergency contacts.",
    actionLabel: "Open SOS",
    actionTo: "/emergency-contacts",
  },
  {
    id: "06",
    title: "Live location sharing",
    category: "Safety",
    priority: "MVP",
    description:
      "Share real-time location with family or friends while commuting, then auto-stop on arrival.",
    actionLabel: "Start Sharing",
    actionTo: "/emergency-contacts",
  },
  {
    id: "07",
    title: "Monthly commute recap",
    category: "UX",
    priority: "V2",
    description:
      "Shareable monthly summary of commute time, spending, and trip highlights.",
    actionLabel: "View Recap",
    actionTo: "/analytics",
  },
  {
    id: "08",
    title: "Offline-first mode",
    category: "UX",
    priority: "MVP",
    description:
      "Core features work without internet and sync automatically when the connection returns.",
    actionLabel: "Offline Status",
    actionTo: "/dashboard",
  },
  {
    id: "09",
    title: "Commute buddy matching",
    category: "Social",
    priority: "V2",
    description:
      "Matches commuters with similar routes and schedules, with verified profiles and chat.",
    actionLabel: "Coming Soon",
  },
  {
    id: "10",
    title: "Harassment & incident reporting",
    category: "Safety",
    priority: "V2",
    description:
      "Report incidents with photo and GPS evidence, then track case status.",
    actionLabel: "Report Incident",
    actionTo: "/emergency-contacts",
  },
  {
    id: "11",
    title: "Office / school group commute",
    category: "Social",
    priority: "V2",
    description:
      "Private groups for shared commute stats, reimbursements, and carpool coordination.",
    actionLabel: "Coming Soon",
  },
  {
    id: "12",
    title: "PWD accessibility mode",
    category: "Essential",
    priority: "V2",
    description:
      "Filters routes for elevator and ramp access with large text and high-contrast options.",
    actionLabel: "Accessibility Settings",
    actionTo: "/settings",
  },
  {
    id: "13",
    title: "Multi-language support",
    category: "Essential",
    priority: "V3",
    description:
      "Supports Filipino, Bisaya, Ilocano, and English for wider nationwide use.",
    actionLabel: "Language Settings",
    actionTo: "/settings",
  },
];

export function ProductRoadmap() {
  return (
    <section className="glass-card rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-byahero-navy sm:text-xl">ByaHero Product Roadmap</h2>
          <p className="text-sm text-byahero-muted">Added priorities for AI, safety, social, and inclusive commute features.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-emerald-200/80 bg-emerald-100/80 px-2 py-1 font-semibold text-emerald-700">MVP</span>
          <span className="rounded-full border border-sky-200/80 bg-sky-100/80 px-2 py-1 font-semibold text-sky-700">V2</span>
          <span className="rounded-full border border-violet-200/80 bg-violet-100/80 px-2 py-1 font-semibold text-violet-700">V3</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {roadmapItems.map((item) => (
          <article key={item.id} className="glass-panel rounded-xl p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-wide text-byahero-blue">#{item.id}</span>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityClasses[item.priority]}`}>{item.priority}</span>
            </div>
            <h3 className="text-sm font-semibold text-byahero-navy sm:text-base">{item.title}</h3>
            <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${categoryClasses[item.category]}`}>{item.category}</p>
            <p className="mt-2 text-sm text-byahero-muted">{item.description}</p>
            {item.actionTo ? (
              <Link
                to={item.actionTo}
                className="mt-3 inline-flex min-h-10 items-center rounded-full bg-[#33b6ff] px-3 text-xs font-semibold text-white"
              >
                {item.actionLabel}
              </Link>
            ) : (
              <span className="mt-3 inline-flex min-h-10 items-center rounded-full border border-[#d7e9ff] bg-white/70 px-3 text-xs font-semibold text-byahero-muted">
                {item.actionLabel}
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
