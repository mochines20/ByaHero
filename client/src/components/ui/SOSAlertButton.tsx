import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { AlertCircle, X, ShieldAlert, Zap } from "lucide-react";
import { api } from "../../lib/api";
import { useToastStore } from "../../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";

interface SOSButtonProps {
  isActive?: boolean;
}

export function SOSAlertButton({ isActive = true }: SOSButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isTriggered, setIsTriggered] = useState(false);
  const [incidentId, setIncidentId] = useState<string>("");
  const holdTimer = useRef<number | null>(null);
  const countdownTimer = useRef<number | null>(null);
  const pushToast = useToastStore((s) => s.pushToast);

  useEffect(() => {
    if (isHolding && countdown > 0) {
      countdownTimer.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(countdownTimer.current);
    }

    if (isHolding && countdown === 0) {
      triggerSOS();
    }
  }, [isHolding, countdown]);

  const triggerSOS = async () => {
    try {
      if (!navigator.geolocation) {
        pushToast("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const { data } = await api.post("/sos/trigger", {
          latitude,
          longitude,
          transportType: "jeepney",
          transportPlate: "",
        });

        setIsTriggered(true);
        setIncidentId(data.incidentId);
        setIsHolding(false);
        pushToast("SOS Alert sent to emergency contacts!");
      });
    } catch (error: any) {
      pushToast(error.message || "Bigo sa pag-trigger ng SOS");
      setIsHolding(false);
      setCountdown(3);
    }
  };

  const cancelSOS = async () => {
    if (!incidentId) return;

    try {
      await api.post("/sos/cancel", { incidentId });
      setIsTriggered(false);
      setIncidentId("");
      pushToast("SOS alert cancelled!");
    } catch (error: any) {
      pushToast(error.message || "Failed to cancel SOS");
    }
  };

  const handleMouseDown = () => {
    if (!isActive || isTriggered) return;
    setIsHolding(true);
    setCountdown(3);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setCountdown(3);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (countdownTimer.current) clearTimeout(countdownTimer.current);
  };

  if (!isActive) return null;

  return (
    <>
      <AnimatePresence>
        {isTriggered && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-32 right-12 z-[100] glass-card bg-red-600/90 rounded-[2.5rem] p-6 border border-white/20 shadow-2xl min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-white animate-pulse" size={20} />
                <span className="font-brand text-xl font-black text-white italic">SOS ACTIVE</span>
              </div>
              <button 
                onClick={cancelSOS} 
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-6">Alert sent to emergency contacts.</p>
            <button
              onClick={cancelSOS}
              className="w-full h-12 rounded-2xl bg-white text-red-600 font-brand font-black text-sm uppercase tracking-widest transition-all active:scale-95"
            >
              Cancel SOS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={clsx(
          "fixed bottom-32 right-12 z-[90] flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl transition-all duration-500 active:scale-90",
          isHolding ? "bg-red-500 ring-8 ring-red-500/20" : "bg-red-600 hover:bg-red-700"
        )}
        title="Hold for 3 seconds to trigger SOS"
      >
        <div className="relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isHolding ? (
              <motion.span 
                key="countdown"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="font-brand text-2xl font-black text-white"
              >
                {countdown}
              </motion.span>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle size={32} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Pulsing ring for holding state */}
        {isHolding && (
          <motion.div 
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 rounded-full bg-red-400"
          />
        )}
      </button>
    </>
  );
}

