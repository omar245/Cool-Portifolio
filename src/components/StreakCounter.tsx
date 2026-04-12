import { Flame, Trophy } from "lucide-react";

interface Props {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCounter({ currentStreak, bestStreak }: Props) {
  return (
    <div className="glass-card p-5 md:p-6 flex items-center gap-6">
      {/* Current streak */}
      <div className="flex items-center gap-3 flex-1">
        <div className={`flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-500 ${
          currentStreak > 0 ? "bg-warning/20 shadow-[0_0_20px_oklch(0.8_0.15_80/25%)]" : "bg-secondary/50"
        }`}>
          <Flame className={`h-6 w-6 transition-colors duration-300 ${currentStreak > 0 ? "text-warning" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-10 w-px bg-border" />

      {/* Best streak */}
      <div className="flex items-center gap-3 flex-1">
        <div className={`flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-500 ${
          bestStreak > 0 ? "bg-primary/20" : "bg-secondary/50"
        }`}>
          <Trophy className={`h-6 w-6 transition-colors duration-300 ${bestStreak > 0 ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{bestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
      </div>
    </div>
  );
}
