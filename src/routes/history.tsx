import { createFileRoute } from "@tanstack/react-router";
import { WeeklyHistory } from "@/components/WeeklyHistory";
import { useProductivityStore } from "@/hooks/use-productivity-store";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Weekly History — Daily Productivity Tracker" },
      { name: "description", content: "View your productivity completion history for the past 7 days" },
      { property: "og:title", content: "Weekly History — Daily Productivity Tracker" },
      { property: "og:description", content: "View your productivity completion history for the past 7 days" },
    ],
  }),
});

function HistoryPage() {
  const { history } = useProductivityStore();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="bg-orb" style={{ width: 400, height: 400, top: "-10%", right: "-5%", background: "oklch(0.65 0.2 300 / 12%)" }} />
      <div className="bg-orb" style={{ width: 300, height: 300, bottom: "10%", left: "-5%", background: "oklch(0.7 0.18 250 / 10%)", animationDelay: "7s" }} />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 md:py-10">
        <WeeklyHistory history={history} />
      </div>
    </div>
  );
}
