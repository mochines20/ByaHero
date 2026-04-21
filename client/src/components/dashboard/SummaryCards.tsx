import { Card } from "../ui/Card";

type Props = { spent: number; trips: number; minutes: number };

export function SummaryCards({ spent, trips, minutes }: Props) {
  const cards = [
    { label: "Today's Spend", value: `PHP ${spent.toFixed(2)}`, tone: "text-byahero-navy" },
    { label: "Trips", value: String(trips), tone: "text-byahero-blue" },
    { label: "Travel Time", value: `${minutes} mins`, tone: "text-byahero-green" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.label} className="rounded-3xl">
          <p className="text-xs text-byahero-muted">{c.label}</p>
          <p className={`mt-1 text-2xl font-bold ${c.tone}`}>{c.value}</p>
        </Card>
      ))}
    </div>
  );
}
