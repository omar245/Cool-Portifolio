import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { LiveClock } from "@/components/LiveClock";
import { DailyChecklist } from "@/components/DailyChecklist";
import { SubjectsTracker } from "@/components/SubjectsTracker";
import { PrayerTracker } from "@/components/PrayerTracker";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { DailyAnalysis } from "@/components/DailyAnalysis";
import { StreakCounter } from "@/components/StreakCounter";
import { Button } from "@/components/ui/button";
import { useProductivityStore } from "@/hooks/use-productivity-store";
import { RotateCcw, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Daily Productivity Tracker" },
      { name: "description", content: "Track your daily tasks, prayers, studies, and workouts" },
    ],
  }),
});

function Index() {
  const store = useProductivityStore();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background orbs */}
      <div className="bg-orb" style={{ width: 400, height: 400, top: "-10%", left: "-5%", background: "oklch(0.7 0.18 250 / 15%)" }} />
      <div className="bg-orb" style={{ width: 300, height: 300, bottom: "10%", right: "-5%", background: "oklch(0.65 0.2 300 / 10%)", animationDelay: "5s" }} />
      <div className="bg-orb" style={{ width: 200, height: 200, top: "40%", left: "50%", background: "oklch(0.7 0.2 150 / 10%)", animationDelay: "10s" }} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Daily Tracker</h1>
            <p className="text-sm text-muted-foreground">Stay consistent. Stay productive.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/schedule">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm("Reset all data for today?")) store.reset();
              }}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>

        {/* Live Clock + Streak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LiveClock />
          <StreakCounter currentStreak={store.streak.currentStreak} bestStreak={store.streak.bestStreak} />
        </div>

        {/* Analysis at top */}
        <div className="mb-6">
          <DailyAnalysis
            percent={store.completionPercent}
            checklistDone={store.checklistDone}
            checklistTotal={store.checklistTotal}
            prayersDone={store.prayersDone}
            prayersTotal={store.prayersTotal}
            subjectsFilled={store.subjectsFilled}
            subjectsTotal={store.subjectsTotal}
            workoutDone={store.state.workoutDone}
          />
        </div>

        {/* Two column layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DailyChecklist
            checklist={store.state.checklist}
            onToggle={store.toggleChecklist}
            done={store.checklistDone}
            total={store.checklistTotal}
          />
          <div className="space-y-6">
            <PrayerTracker
              prayers={store.state.prayers}
              onToggle={store.togglePrayer}
              done={store.prayersDone}
              total={store.prayersTotal}
            />
            <WorkoutTracker
              done={store.state.workoutDone}
              notes={store.state.workoutNotes}
              onToggle={store.toggleWorkout}
              onNotesChange={store.setWorkoutNotes}
            />
          </div>
        </div>

        {/* Subjects full width */}
        <div className="mb-10">
          <SubjectsTracker
            subjects={store.state.subjects}
            onUpdate={store.setSubject}
            filled={store.subjectsFilled}
            total={store.subjectsTotal}
          />
        </div>
      </div>
    </div>
  );
}
