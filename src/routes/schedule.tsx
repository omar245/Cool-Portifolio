import { createFileRoute } from "@tanstack/react-router";
import { StudySchedule } from "@/components/StudySchedule";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
  head: () => ({
    meta: [
      { title: "Study Schedule — Daily Productivity Tracker" },
      { name: "description", content: "Your daily study and activity schedule with live time tracking" },
      { property: "og:title", content: "Study Schedule — Daily Productivity Tracker" },
      { property: "og:description", content: "Your daily study and activity schedule with live time tracking" },
    ],
  }),
});

function SchedulePage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background orbs */}
      <div className="bg-orb" style={{ width: 400, height: 400, top: "-10%", left: "-5%", background: "oklch(0.7 0.18 250 / 15%)" }} />
      <div className="bg-orb" style={{ width: 300, height: 300, bottom: "10%", right: "-5%", background: "oklch(0.65 0.2 300 / 10%)", animationDelay: "5s" }} />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 md:py-10">
        <StudySchedule />
      </div>
    </div>
  );
}
