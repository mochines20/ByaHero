export function SavingsCard({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const positive = diff < 0;

  return (
    <div className="rounded-xl border border-byahero-light bg-white p-4 shadow-card">
      <p className="text-sm text-byahero-muted">Savings vs Last Month</p>
      <p className="mt-1 text-2xl font-bold text-byahero-navy">?{Math.abs(diff).toFixed(2)}</p>
      <p className={`text-sm ${positive ? "text-byahero-green" : "text-red-600"}`}>
        {positive ? "You spent less than last month." : "You spent more than last month."}
      </p>
    </div>
  );
}
