import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Trash2, Plus, ShieldAlert, PhoneCall, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/uiStore";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyContactsPage() {
  const user = useAuthStore((s) => s.user);
  const [contacts, setContacts] = useState<string[]>(user?.emergencyContacts || []);
  const [newContact, setNewContact] = useState("");
  const [loading, setLoading] = useState(false);
  const pushToast = useToastStore((s) => s.pushToast);

  const addContact = async () => {
    if (!newContact.trim()) {
      pushToast("Pakisulat muna ang contact hero mo.");
      return;
    }

    setLoading(true);
    try {
      const updatedContacts = [...contacts, newContact];
      await api.put("/users/profile", {
        emergencyContacts: updatedContacts,
      });
      setContacts(updatedContacts);
      setNewContact("");
      pushToast("Tagumpay! Idinagdag na ang iyong protector.");
    } catch (error: any) {
      pushToast(error.message || "Bigo sa pag-dagdag ng contact.");
    } finally {
      setLoading(false);
    }
  };

  const removeContact = async (contact: string) => {
    setLoading(true);
    try {
      const updatedContacts = contacts.filter((c) => c !== contact);
      await api.put("/users/profile", {
        emergencyContacts: updatedContacts,
      });
      setContacts(updatedContacts);
      pushToast("Burado na ang iyong protector.");
    } catch (error: any) {
      pushToast(error.message || "Bigo sa pag-bura ng contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter">Emergency Contacts</h2>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Ang iyong mga Tagapagligtas.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="text-byahero-yellow" size={24} />
              <h3 className="font-brand text-2xl font-black text-white">Handa sa Sakuna?</h3>
            </div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">
              Ang mga sumusunod na contacts ay makakatanggap ng mensahe kapag pinindot mo ang SOS button sa iyong byahe.
            </p>
          </div>
          
          <div className="flex gap-2 min-w-[300px]">
            <Input
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              placeholder="Pangalan o Numero"
              className="!h-13"
              disabled={loading}
            />
            <button 
              onClick={addContact} 
              disabled={loading}
              className="flex h-13 w-13 items-center justify-center rounded-2xl bg-byahero-yellow text-byahero-navy shadow-yellow transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Decorative Alert Pattern */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none rotate-12">
          <AlertCircle size={200} />
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence>
          {contacts.length === 0 ? (
            <div className="md:col-span-2 py-12 glass-card rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-30">
              <PhoneCall size={32} className="mb-3" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">Wala pang emergency contacts...</p>
            </div>
          ) : (
            contacts.map((contact, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card flex items-center justify-between p-6 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-byahero-yellow">
                    <PhoneCall size={18} />
                  </div>
                  <span className="font-brand text-xl font-black text-white group-hover:text-byahero-yellow transition-colors">{contact}</span>
                </div>
                <button
                  onClick={() => removeContact(contact)}
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
                  aria-label="Remove Contact"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] border border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">
          "Ang tunay na hero, laging handa sa anumang aberya."
        </p>
      </div>
    </div>
  );
}
