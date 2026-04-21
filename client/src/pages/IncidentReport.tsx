import { FormEvent, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

type Report = { id: string; createdAt: string; type: string; details: string; location?: string };
const storageKey = "byahero.incidents.v1";

export function IncidentReportPage() {
  const [type, setType] = useState("harassment");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setReports(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reports));
  }, [reports]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    const report: Report = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      type,
      details: details.trim(),
      location: location.trim() || undefined,
    };
    setReports((s) => [report, ...s]);
    setDetails("");
    setLocation("");
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">Incident Reporting</h1>
        <p className="mt-1 text-sm text-byahero-muted">Functional reporting flow (stored locally). Later we can integrate LTFRB/case tracking.</p>
      </Card>

      <Card className="rounded-3xl">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-byahero-muted">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 min-h-11 w-full rounded-2xl border border-[#d7e9ff] bg-white/92 px-3 text-sm">
              <option value="harassment">Harassment</option>
              <option value="pickpocket">Pickpocketing</option>
              <option value="dangerous-driver">Dangerous driver</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-byahero-muted">Details</label>
            <Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe what happened..." />
          </div>
          <div>
            <label className="text-xs text-byahero-muted">Location (optional)</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., MRT Shaw Blvd, EDSA" />
          </div>
          <Button>Submit report</Button>
        </form>
      </Card>

      <Card className="rounded-3xl">
        <h3 className="text-sm font-semibold text-byahero-navy">Your submitted reports</h3>
        <div className="mt-3 space-y-2">
          {reports.length === 0 ? (
            <p className="text-sm text-byahero-muted">No reports yet.</p>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[#dceafd] bg-white/85 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">{r.type}</span>
                  <span className="text-xs text-byahero-muted">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-byahero-navy">{r.details}</p>
                {r.location ? <p className="mt-1 text-xs text-byahero-muted">Location: {r.location}</p> : null}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

