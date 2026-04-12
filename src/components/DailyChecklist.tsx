import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  checklist: Record<string, boolean>;
  onToggle: (key: string) => void;
  done: number;
  total: number;
}

const LABELS: Record<string, string> = {
  "study-1": "Study 2h (Session 1)",
  "study-2": "Study 2h (Session 2)",
  "study-3": "Study 2h (Session 3)",
  "programming-1": "Programming 1h (Session 1)",
  "programming-2": "Programming 1h (Session 2)",
  workout: "Workout",
};

export function DailyChecklist({ checklist, onToggle, done, total }: Props) {
  return (
    <div className="glass-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">📋 Daily Checklist</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/20 text-primary">
          {done}/{total}
        </span>
      </div>
      <div className="space-y-3">
        {Object.entries(checklist).map(([key, checked]) => (
          <label
            key={key}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-secondary/50 ${
              checked ? "glow-success bg-success/5" : ""
            }`}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggle(key)}
              className={`h-5 w-5 ${checked ? "checkbox-bounce" : ""}`}
            />
            <span className={`text-sm transition-all duration-300 ${checked ? "task-checked" : "text-foreground"}`}>
              {LABELS[key] || key}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
