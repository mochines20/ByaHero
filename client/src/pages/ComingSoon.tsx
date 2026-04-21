import { Card } from "../components/ui/Card";

export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-byahero-muted">{description}</p>
      </Card>

      <Card className="rounded-3xl">
        <p className="text-sm text-byahero-muted">
          This feature is marked as V2 and will be implemented after MVP validation. The button is already wired here so it has a permanent place in the app.
        </p>
      </Card>
    </div>
  );
}

