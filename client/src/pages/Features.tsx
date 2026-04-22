import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

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
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Mga Features</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Bawat roadmap item, silyado para sa mga Hero.</p>
      </motion.header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, idx) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="group relative h-full flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black tracking-tighter text-byahero-yellow italic">#{f.id}</span>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 border border-white/10">
                    {f.priority === "MVP" ? <Zap size={10} className="text-byahero-yellow" /> : <ShieldCheck size={10} className="text-white/40" />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">{f.priority}</span>
                  </div>
                </div>
                
                <h3 className="font-brand text-xl font-black text-white group-hover:text-byahero-yellow transition-colors leading-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm font-bold text-white/60 leading-relaxed mb-6">
                  {f.description}
                </p>
              </div>

              <div className="mt-auto">
                <Link 
                  to={f.to ?? "/features"} 
                  className="flex h-12 w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-byahero-yellow hover:text-byahero-navy hover:shadow-yellow transition-all"
                >
                  {f.actionLabel}
                </Link>
              </div>

              {/* Decorative Background Blur */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-byahero-blue/10 blur-3xl group-hover:bg-byahero-yellow/10 transition-all" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

